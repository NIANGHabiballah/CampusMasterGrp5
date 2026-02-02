// Script de diagnostic API
const API_BASE = 'http://localhost:8082';

// Test des endpoints principaux
const endpoints = [
  '/api/courses',
  '/api/assignments',
  '/api/messages',
  '/api/notifications',
  '/api/users'
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    console.log(`✅ ${endpoint}: ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.log(`   Error: ${text.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.message}`);
  }
}

async function runTests() {
  console.log('🔍 Test des endpoints API...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n🔍 Test avec authentification...');
  
  // Test login
  try {
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'etudiant@campus.sn', password: 'password' })
    });
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login réussi:', data.user?.email);
      
      // Test avec token
      const token = data.token;
      const authResponse = await fetch(`${API_BASE}/api/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Requête authentifiée: ${authResponse.status}`);
    } else {
      console.log('❌ Login échoué:', loginResponse.status);
    }
  } catch (error) {
    console.log('❌ Erreur login:', error.message);
  }
}

runTests();