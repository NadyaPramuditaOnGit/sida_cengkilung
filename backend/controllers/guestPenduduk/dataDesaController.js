const { pool } = require('../../config/db');
const SSEService = require('../../services/sse');

const validJenis = ['Kependudukan', 'Agama', 'Pekerjaan', 'Pendidikan', 'Usia', 'Status'];

const validateJenis = (jenis) => validJenis.includes(jenis);

const withConnection = async (callback) => {
  let connection;
  try {
    connection = await pool.getConnection();
    return await callback(connection);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

const getDataByJenis = async (jenis, tahun = 'Semua') => {
  if (!validateJenis(jenis)) {
    throw new Error('Jenis data tidak valid');
  }

  return withConnection(async (connection) => {
    let query = `
      SELECT 
        id_data as id,
        keterangan as label,
        jumlah_laki,
        jumlah_perempuan,
        tahun,
        diperbarui_pada as updated_at
      FROM data_desa
      WHERE jenis_data = ?
    `;
    const params = [jenis];

    if (tahun !== 'Semua') {
      if (!/^\d{4}$/.test(tahun)) {
        throw new Error('Format tahun tidak valid');
      }
      query += ' AND tahun = ?';
      params.push(tahun);
    }

    query += ' ORDER BY updated_at DESC';

    const [rows] = await connection.query(query, params);
    return rows.map(item => ({
      ...item,
      total: item.jumlah_laki + item.jumlah_perempuan
    }));
  });
};

const getTotalByJenis = async (jenis) => {
  if (!validateJenis(jenis)) {
    throw new Error('Jenis data tidak valid');
  }

  return withConnection(async (connection) => {
    const [rows] = await connection.query(`
      SELECT 
        SUM(jumlah_laki) as total_laki,
        SUM(jumlah_perempuan) as total_perempuan,
        SUM(jumlah_laki + jumlah_perempuan) as total
      FROM data_desa
      WHERE jenis_data = ?
    `, [jenis]);

    return rows[0] || { total_laki: 0, total_perempuan: 0, total: 0 };
  });
};

exports.getDataDesaByJenis = async (req, res) => {
  try {
    const { jenis, tahun = 'Semua' } = req.query;

    if (!jenis) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "jenis" wajib diisi'
      });
    }

    if (!validateJenis(jenis)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis data tidak valid'
      });
    }

    const [data, total] = await Promise.all([
      getDataByJenis(jenis, tahun),
      getTotalByJenis(jenis)
    ]);

    const response = { 
      success: true, 
      data,
      total
    };

    try {
      // Ganti WebSocket broadcast ke SSE broadcast
      const featureName = 'data-desa';
      if (SSEService.getClientCount(featureName) > 0) {
        SSEService.broadcast(featureName, 'DATA_DESA_UPDATE', {
          jenis,
          tahun,
          data,
          total,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (sseError) {
      console.error('SSE broadcast failed:', sseError);
    }

    res.json(response);

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      data: [],
      total: { total_laki: 0, total_perempuan: 0, total: 0 }
    });
  }
};

exports.getTotalDataDesaByJenis = async (req, res) => {
  try {
    const { jenis } = req.query;

    if (!jenis) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "jenis" wajib diisi'
      });
    }

    if (!validateJenis(jenis)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis data tidak valid'
      });
    }

    const total = await getTotalByJenis(jenis);
    
    res.json({
      success: true,
      total,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      total: { total_laki: 0, total_perempuan: 0, total: 0 }
    });
  }
};