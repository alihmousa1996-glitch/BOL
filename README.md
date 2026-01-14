# 📄 Bill of Lading (BOL) Generator

Professional web-based Bill of Lading generator for CIF Canada.

## 🎯 Features

✅ **Complete BOL Form** - All standard BOL fields
✅ **Multiple Vehicles** - Add unlimited vehicles/cargo
✅ **PDF Generation** - Professional PDF output
✅ **Sample Data** - Quick test with pre-filled data
✅ **Calculations** - Automatic weight and measurement totals
✅ **Mobile Friendly** - Responsive design
✅ **No Backend Required** - Pure client-side JavaScript

## 📁 Files

- `index.html` - Main BOL form
- `bol-generator.js` - PDF generation logic
- `README.md` - This file

## 🚀 How to Use

### Option 1: Local Testing

1. Download both files to a folder
2. Open `index.html` in your web browser
3. Fill out the form or click "Load Sample Data"
4. Click "Generate BOL PDF"
5. PDF downloads automatically!

### Option 2: GitHub Pages

1. Create a new repository on GitHub
2. Upload `index.html` and `bol-generator.js`
3. Enable GitHub Pages in Settings
4. Access via: `https://yourusername.github.io/repository-name/`

### Option 3: Add to Existing Site

1. Create a folder: `/bol-generator/`
2. Upload both files to that folder
3. Access via: `https://yoursite.com/bol-generator/`

## 📋 Form Sections

### 1. Shipper & Consignee Information
- Exporter name and address
- Consignee name and address  
- Notify party information

### 2. Document Information
- Document number
- B/L number
- Export references

### 3. Routing & Carrier Information
- Forwarding agent
- Pre-carriage carrier
- Exporting carrier
- Ports (loading, unloading, delivery)
- Type of move
- Loading terminal

### 4. Container Information
- Container number and type
- Seal number
- CERS number
- Free days

### 5. Vehicles/Cargo
- Work order number
- VIN
- Year, Make, Model
- Weight (Kg)
- Measurement (ft³)
- **Add multiple vehicles**

### 6. Additional Information
- Date
- Place dated
- Freight service type
- Currency

## 🔧 Customization

### Change Logo
Edit `index.html` line with the logo:
```html
<img src="your-logo.png" alt="Logo" class="h-16">
```

### Change Colors
Edit the header color in `index.html`:
```html
<header class="bg-blue-900 ...">
```

### Modify PDF Layout
Edit `bol-generator.js` in the `generatePDF()` function.

## 💡 Quick Actions

### Load Sample Data
Click "Load Sample Data" button to fill form with example:
- 3 vehicles
- Complete shipper/consignee info
- Container details
- All routing information

### Add Vehicles
Click "➕ Add Another Vehicle" to add more cargo entries.

### Remove Vehicles
Click "✕ Remove" on any vehicle (minimum 1 required).

### Clear Form
Click "Clear Form" to reset all fields (keeps date and 1 vehicle).

## 📊 Calculations

The system automatically calculates:

- **Total Weight (Kg)** - Sum of all vehicles
- **Total Weight (Lb)** - Converted (×2.20462)
- **Total Measurement (ft³)** - Sum of all vehicles
- **Total Measurement (Vlb)** - Virtual pounds (×1.04)

All displayed on the PDF in container section.

## 🎨 PDF Output Includes

✅ Professional header with CIF Canada branding
✅ All shipper and consignee information
✅ Complete routing details
✅ Container information
✅ Detailed vehicle table with weights
✅ CERS number and free days
✅ Legal disclaimers
✅ Date and signature section
✅ Proper formatting and spacing

## 🔐 Data Privacy

✅ **No server required** - Everything runs in browser
✅ **No data stored** - Form clears on refresh
✅ **No data sent** - Nothing leaves your computer
✅ **Client-side only** - Complete privacy

## 📱 Mobile Responsive

✅ Works on desktop
✅ Works on tablets
✅ Works on smartphones
✅ Adaptive layout
✅ Touch-friendly buttons

## 🆘 Troubleshooting

### PDF Not Generating
- Check that all required fields are filled
- Make sure JavaScript is enabled
- Try a different browser (Chrome/Firefox recommended)

### PDF Layout Issues
- Adjust text in `bol-generator.js`
- Modify `yPos` values for spacing
- Test with different data lengths

### Form Not Responding
- Refresh the page
- Check browser console (F12) for errors
- Ensure both files are in same folder

## 🌐 Browser Support

✅ Chrome (recommended)
✅ Firefox
✅ Edge
✅ Safari
✅ Opera

Requires modern browser with ES6 support.

## 📦 Dependencies

### Included via CDN:
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - Table formatting
- **Tailwind CSS** - Styling

No installation required!

## ✨ Tips

1. **Save frequently** - Use browser's form autofill
2. **Test with sample** - Click "Load Sample Data" first
3. **Check PDF** - Review before sending to clients
4. **Keep backups** - Download PDFs regularly
5. **Customize** - Add your company logo

## 📄 License

Free to use and modify for CIF Canada operations.

## 🎊 Ready to Use!

1. Upload files to GitHub
2. Fill out form
3. Generate PDF
4. Done!

**Professional BOL generation in seconds!** 🚀
