import React from 'react';
import InputField from './components/InputField/InputField';
import { RiUserLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react';

function App() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('user@example.com');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [file, setFile] = React.useState(null);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Username Input */}
      <InputField
        title="Username"
        value={username}
        onChange={setUsername}  // Directly pass setUsername as it receives the value
        enabled={true}
        customIcon={<RiUserLine size={20} />}
        validationRules={{
          required: true,
          minLength: 3,
          message: "Username must be at least 3 characters"
        }}
      />

      {/* Email Input (disabled) */}
      <InputField
        title="Email"
        value={email}
        onChange={setEmail}
        enabled={false}
      />

      {/* Password Input with toggle */}
      <InputField
        title="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={setPassword}
        iconEnabled={true}
        customIcon={showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
        validationRules={{
          required: true,
          minLength: 8,
          message: "Password must be at least 8 characters"
        }}
      />

      {/* File Upload Input */}
      <InputField
        title="Upload File"
        type="file"
        enabled={!isUploading}
        onChange={setFile}  // Receives File object directly
      />

      {/* Control Buttons */}
      <div className="mt-8 space-x-4">
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          {isUploading ? 'Cancel Upload' : 'Upload File'}
        </button>
      </div>

      {/* Debug Output */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Current Values:</h3>
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>Password: {password ? '••••••••' : 'empty'}</p>
        <p>File: {file?.name || 'No file selected'}</p>
      </div>
    </div>
  );
}

export default App;