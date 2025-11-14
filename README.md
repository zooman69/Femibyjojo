# Femi By Jojo - Inventory Management System

A comprehensive web-based inventory management system with Wix e-commerce integration for managing product catalogs.

## Features

### 📦 Inventory Management
- **CSV Import/Export** - Import your product catalog from CSV and export changes
- **Product Editing** - Edit product details including name, price, inventory, visibility
- **Add New Products** - Create new product entries directly in the interface
- **Delete Products** - Remove products with confirmation
- **Bulk Selection** - Select multiple products for batch operations

### 🔍 Search & Filter
- **Real-time Search** - Search by product name, SKU, or collection
- **Collection Filter** - Filter products by collection
- **Visibility Filter** - Show only visible or hidden products
- **Sortable Columns** - Click column headers to sort data
- **Pagination** - Display 25, 50, 100, or all products per page

### 📊 Dashboard
- **Total Products** - Count of all products in inventory
- **Visible Products** - Count of products visible on your store
- **Total Inventory Value** - Total value of all inventory
- **Last Sync Time** - Timestamp of last Wix synchronization

### 🔄 Wix Integration
- **Direct API Sync** - Sync products directly to your Wix store
- **Bulk Sync** - Sync all products at once
- **Selective Sync** - Sync only selected products
- **Single Product Sync** - Sync individual products
- **Sync Status Tracking** - Visual indicators for sync status
- **Error Logging** - Detailed error messages for failed syncs

## Files

- **inventory-manager.html** - Basic inventory manager (no Wix integration)
- **inventory-manager-wix.html** - Full-featured manager with Wix API integration
- **catalog_products 2025-11-14.csv** - Your product catalog data

## Getting Started

### Using the Basic Inventory Manager

1. Open `inventory-manager.html` in your web browser
2. Click "Load CSV File" and select `catalog_products 2025-11-14.csv`
3. Browse, search, and manage your products
4. Click "Export to CSV" to save changes

### Using the Wix Integration

1. Open `inventory-manager-wix.html` in your web browser
2. Click on the Wix status indicator in the header
3. Enter your Wix API credentials:
   - **Wix Site ID** - Found in Wix Dashboard → Settings → Business Info
   - **API Key** - Create at [Wix Developers](https://dev.wix.com/api/rest/getting-started/authentication)
   - **Account ID** - Your Wix account ID
4. Click "Test Connection" to verify your credentials
5. Click "Save Settings"
6. Load your CSV file
7. Use the sync buttons to update your Wix store

## Wix API Setup

### Step 1: Get Your API Credentials

1. Go to [Wix Developers](https://dev.wix.com/)
2. Log in to your Wix account
3. Navigate to **API Keys** section
4. Create a new API Key with the following permissions:
   - `wix.stores.catalog-items.read`
   - `wix.stores.catalog-items.write`
   - `wix.stores.products.read`
   - `wix.stores.products.write`

### Step 2: Find Your Site ID

1. Log in to your Wix account
2. Go to **Settings** → **Business Info**
3. Copy your Site ID (UUID format)

### Step 3: Configure the Inventory Manager

1. Open `inventory-manager-wix.html`
2. Click the Wix status indicator
3. Paste your credentials
4. Test the connection
5. Save settings

### Step 4: Sync Products

- **Sync All** - Updates all products in your catalog
- **Sync Selected** - Updates only checked products
- **Sync Single** - Click the "Sync" button on individual products

## Sync Behavior

- **Existing Products** - Products with matching SKUs will be updated
- **New Products** - Products without matching SKUs will be created
- **Inventory Updates** - Stock quantities are updated on Wix
- **Price Updates** - Product prices are synced to Wix
- **Visibility** - Product visibility status is updated

## Product Fields

The system manages the following product fields:

- **name** - Product name
- **collection** - Product collection/category
- **sku** - Stock Keeping Unit (unique identifier)
- **price** - Product price
- **cost** - Cost of goods
- **inventory** - Stock quantity
- **visible** - Visibility status (TRUE/FALSE)
- **ribbon** - Product ribbon/badge text
- **weight** - Product weight
- **brand** - Brand name (default: Femi By Jojo)
- **productImageUrl** - Product image (Wix media format)

## Browser Compatibility

Works best in modern browsers:
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Security Notes

- API credentials are stored in browser localStorage
- Never share your API key publicly
- Use HTTPS when deploying to production
- Regularly rotate your API keys

## Troubleshooting

### Connection Failed
- Verify your API credentials are correct
- Check that your API key has the required permissions
- Ensure your Site ID is correct

### Sync Errors
- Check the sync status column for error messages
- Verify products have all required fields
- Ensure SKUs are unique

### CSV Not Loading
- Verify the CSV is properly formatted
- Check for encoding issues (should be UTF-8)
- Ensure file size is reasonable

## Support

For issues or questions:
- Check the Wix API documentation: https://dev.wix.com/api/rest/wix-stores/catalog/products
- Review the browser console for error messages
- Verify your API permissions

## License

This project is for Femi By Jojo inventory management.

---

**Last Updated:** 2025-11-14
