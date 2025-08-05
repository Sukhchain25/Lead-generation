module.exports = {
  // CottonEdge Templates (existing)
  cottonedge: {
    catalogSuccess: (email) => ({
      subject: "Your CottonEdge Exports Catalog is Here!",
      html: `<!DOCTYPE html><html><head>...</head><body>...</body></html>`,
    }),
    catalogUnavailable: (email) => ({
      subject: "We're Preparing Your Catalog",
      html: `<!DOCTYPE html><html><head>...</head><body>...</body></html>`,
    }),
  },

  // Havve Templates (new)
  havve: {
    catalogSuccess: (email) => ({
      subject: "🌿 Your Havve Sustainable Tableware Catalog",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Havve Catalog</title>
        <style>
          :root {
            --primary: #4a9f66;
            --primary-light: #6bbd8b;
            --secondary: #f5a623;
            --dark: #2c3e33;
            --light: #f8faf7;
          }
          
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: var(--dark);
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f8faf7;
          }
          
          .header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          
          .content {
            padding: 30px;
            background-color: white;
          }
          
          .footer {
            background-color: var(--dark);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          
          .button {
            background: var(--primary);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 50px;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .button:hover {
            background: var(--primary-light);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 159, 102, 0.2);
          }
          
          .eco-badge {
            display: inline-flex;
            align-items: center;
            background-color: rgba(74, 159, 102, 0.1);
            border-radius: 50px;
            padding: 8px 16px;
            font-size: 14px;
            margin: 15px 0;
          }
          
          .product-showcase {
            margin: 25px 0;
            border: 1px solid #e2e8e5;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', serif;">Havve</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 16px;">Sustainable Tableware Solutions</p>
        </div>
        
        <div class="content">
          <h2 style="color: var(--primary); margin-top: 0;">Your Eco-Friendly Catalog is Here!</h2>
          
          <p>Dear Eco-Conscious Partner,</p>
          
          <div class="eco-badge">
            <span style="margin-right: 8px;">🌱</span>
            <span>100% Compostable • 90-Day Decomposition</span>
          </div>
          
          <p>We're thrilled to share our latest collection of bagasse tableware with you. The catalog is attached to this email and includes:</p>
          
          <ul style="padding-left: 20px;">
            <li>Our complete range of plant-based tableware</li>
            <li>Detailed specifications and certifications</li>
            <li>Custom branding options</li>
            <li>Bulk order benefits</li>
            <li>Sustainability impact metrics</li>
          </ul>
          
          <a href="mailto:contact@havve.in" class="button">Contact Our Sales Team</a>
          
          <p style="margin-bottom: 0;">With green regards,</p>
          <p style="margin-top: 5px; font-weight: 600;">The Havve Team</p>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <a href="https://facebook.com/havve" style="color: white; margin: 0 10px;">Facebook</a>
            <a href="https://instagram.com/havve.eco" style="color: white; margin: 0 10px;">Instagram</a>
            <a href="https://linkedin.com/company/havve" style="color: white; margin: 0 10px;">LinkedIn</a>
          </div>
          <p style="margin: 5px 0;">Havve Eco Solutions &copy; ${new Date().getFullYear()}</p>
          <p style="margin: 5px 0; font-size: 11px; opacity: 0.8;">
            Committed to reducing single-use plastic waste through sustainable alternatives
          </p>
        </div>
      </body>
      </html>
      `,
    }),

    catalogUnavailable: (email) => ({
      subject: "🌱 Your Havve Catalog is Coming Soon!",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Havve Catalog Coming Soon</title>
        <style>
          /* Same root variables and base styles as above */
          .highlight-box {
            background-color: rgba(74, 159, 102, 0.08);
            border-left: 4px solid var(--primary);
            padding: 20px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', serif;">Havve</h1>
        </div>
        
        <div class="content">
          <h2 style="color: var(--primary); margin-top: 0;">We're Updating Our Catalog!</h2>
          
          <div class="highlight-box">
            <p style="margin: 0; font-weight: 500;">
              We're currently refreshing our catalog with new sustainable products and will send it to <strong>${email}</strong> within 24 hours.
            </p>
          </div>
          
          <p>Thank you for choosing sustainable solutions!</p>
          
          <p style="margin-bottom: 0;">Eco-friendly regards,</p>
          <p style="margin-top: 5px; font-weight: 600;">The Havve Team</p>
        </div>
        
        <div class="footer">
          <p style="margin: 5px 0;">Havve Eco Solutions &copy; ${new Date().getFullYear()}</p>
          <p style="margin: 5px 0; font-size: 11px; opacity: 0.8;">
            Transforming agricultural waste into premium tableware
          </p>
        </div>
      </body>
      </html>
      `,
    }),
  },
};
