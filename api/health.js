// Health check endpoint for monitoring
export default function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if environment variables are set
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        geminiConfigured: hasGeminiKey,
        version: '1.0.0'
    });
}
