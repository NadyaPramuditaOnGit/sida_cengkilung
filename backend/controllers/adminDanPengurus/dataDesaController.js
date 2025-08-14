const { pool } = require('../../config/db');
const SSEService = require('../../services/sse'); // Ganti WebSocket ke SSE

// Helper function
const getDataByJenis = async (jenis, tahun = 'Semua') => {
  let query = `
    SELECT 
      id_data as id,
      keterangan as label,
      jumlah_laki,
      jumlah_perempuan,
      (jumlah_laki + jumlah_perempuan) as total,
      tahun,
      diperbarui_pada
    FROM data_desa
    WHERE jenis_data = ?
  `;
  const params = [jenis];

  if (tahun && tahun !== 'Semua') {
    query += ' AND tahun = ?';
    params.push(tahun);
  }

  query += ' ORDER BY id_data ASC';

  const connection = await pool.getConnection();
  const [rows] = await connection.query(query, params);
  connection.release();

  return rows.length > 0 ? rows : [{
    id: 0,
    label: `Belum ada data untuk ${jenis}${tahun ? ' tahun ' + tahun : ''}`,
    jumlah_laki: 0,
    jumlah_perempuan: 0,
    total: 0,
    tahun: tahun || '-'
  }];
};

// Get data by jenis
exports.getDataDesaByJenis = async (req, res) => {
  try {
    const { jenis, tahun } = req.query;
    if (!jenis) {
      return res.status(400).json({ 
        success: false,
        error: 'Parameter jenis wajib diisi.' 
      });
    }

    const data = await getDataByJenis(jenis, tahun);
    res.json({ success: true, data });
  } catch (error) {
    console.error('[GET DATA DESA ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: 'Gagal mengambil data desa' 
    });
  }
};

// Create data
exports.createDataDesa = async (req, res) => {
  const { jenis_data, jumlah_laki, jumlah_perempuan, tahun, keterangan } = req.body;
  const diperbarui_oleh = req.user.id;

  if (!jenis_data || !tahun) {
    return res.status(400).json({ 
      success: false,
      error: 'Jenis data dan tahun wajib diisi.' 
    });
  }

  try {
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      INSERT INTO data_desa 
        (jenis_data, jumlah_laki, jumlah_perempuan, tahun, keterangan, diperbarui_oleh)
      VALUES 
        (?, ?, ?, ?, ?, ?)
    `, [
      jenis_data, 
      jumlah_laki || 0, 
      jumlah_perempuan || 0, 
      tahun, 
      keterangan || '', 
      diperbarui_oleh
    ]);

    const [newData] = await connection.execute(`
      SELECT * FROM data_desa WHERE id_data = ?
    `, [result.insertId]);

    connection.release();

    // Broadcast SSE update
    SSEService.broadcast('data-desa', 'DATA_DESA_UPDATE', {
      action: 'create',
      data: newData[0]
    });

    res.status(201).json({ 
      success: true,
      message: 'Data berhasil ditambahkan',
      data: newData[0]
    });
  } catch (error) {
    console.error('[CREATE ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: 'Gagal menambahkan data' 
    });
  }
};

// Update data
exports.updateDataDesa = async (req, res) => {
  const { id } = req.params;
  const { jumlah_laki, jumlah_perempuan, tahun, keterangan } = req.body;
  const diperbarui_oleh = req.user.id;

  try {
    const connection = await pool.getConnection();
    
    // Check if data exists
    const [cek] = await connection.execute(
      `SELECT * FROM data_desa WHERE id_data = ?`, 
      [id]
    );
    
    if (cek.length === 0) {
      connection.release();
      return res.status(404).json({ 
        success: false,
        error: 'Data tidak ditemukan' 
      });
    }

    // Update data
    await connection.execute(`
      UPDATE data_desa SET
        jumlah_laki = ?, 
        jumlah_perempuan = ?, 
        tahun = ?, 
        keterangan = ?, 
        diperbarui_oleh = ?
      WHERE id_data = ?
    `, [
      jumlah_laki || 0, 
      jumlah_perempuan || 0, 
      tahun, 
      keterangan, 
      diperbarui_oleh, 
      id
    ]);

    // Get updated data
    const [updatedData] = await connection.execute(
      `SELECT * FROM data_desa WHERE id_data = ?`, 
      [id]
    );

    connection.release();

    // Broadcast SSE update
    SSEService.broadcast('data-desa', 'DATA_DESA_UPDATE', {
      action: 'update',
      data: updatedData[0]
    });

    res.json({ 
      success: true,
      message: 'Data berhasil diperbarui',
      data: updatedData[0]
    });
  } catch (error) {
    console.error('[UPDATE ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: 'Gagal memperbarui data' 
    });
  }
};

// Delete data
exports.deleteDataDesa = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    
    // Check if data exists
    const [cek] = await connection.execute(
      `SELECT * FROM data_desa WHERE id_data = ?`, 
      [id]
    );
    
    if (cek.length === 0) {
      connection.release();
      return res.status(404).json({ 
        success: false,
        error: 'Data tidak ditemukan' 
      });
    }

    // Delete data
    await connection.execute(
      `DELETE FROM data_desa WHERE id_data = ?`, 
      [id]
    );

    connection.release();

    // Broadcast SSE update
    SSEService.broadcast('data-desa', 'DATA_DESA_UPDATE', {
      action: 'delete',
      data: { id }
    });

    res.json({ 
      success: true,
      message: 'Data berhasil dihapus' 
    });
  } catch (error) {
    console.error('[DELETE ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: 'Gagal menghapus data' 
    });
  }
};