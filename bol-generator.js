// Bill of Lading Generator JavaScript

// Initialize date to today
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('bolDate').value = new Date().toISOString().split('T')[0];
});

// Add vehicle function
function addVehicle() {
  const container = document.getElementById('vehiclesContainer');
  const vehicleCount = container.children.length + 1;
  
  const vehicleHTML = `
    <div class="vehicle-row">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-gray-700">Vehicle ${vehicleCount}</h3>
        <button type="button" onclick="removeVehicle(this)" class="text-red-600 hover:text-red-800 font-bold">✕ Remove</button>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="form-label">VIN Number</label>
          <input type="text" class="form-input vehicle-vin" placeholder="JN8AT3DD5MW302014">
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-3">
        <div>
          <label class="form-label">Year / Make / Model</label>
          <input type="text" class="form-input vehicle-full" placeholder="2021 NISSAN ROGUE PLATINUM">
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-3">
        <div>
          <label class="form-label">Weight (Kg)</label>
          <input type="number" step="0.01" class="form-input vehicle-weight" placeholder="1647.90">
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', vehicleHTML);
}

// Remove vehicle function
function removeVehicle(button) {
  const vehicleRow = button.closest('.vehicle-row');
  const container = document.getElementById('vehiclesContainer');
  
  if (container.children.length > 1) {
    vehicleRow.remove();
    updateVehicleNumbers();
  } else {
    alert('⚠️ At least one vehicle is required!');
  }
}

// Update vehicle numbers
function updateVehicleNumbers() {
  const vehicles = document.querySelectorAll('.vehicle-row');
  vehicles.forEach((vehicle, index) => {
    const heading = vehicle.querySelector('h3');
    heading.textContent = `Vehicle ${index + 1}`;
  });
}

// Clear form
function clearForm() {
  if (confirm('Are you sure you want to clear all form data?')) {
    document.getElementById('bolForm').reset();
    document.getElementById('bolDate').value = new Date().toISOString().split('T')[0];
    
    // Keep only one vehicle
    const container = document.getElementById('vehiclesContainer');
    while (container.children.length > 1) {
      container.removeChild(container.lastChild);
    }
  }
}

// Load sample data
function loadSample() {
  // Exporter
  document.getElementById('exporterName').value = 'ROSS AUTO SALES';
  document.getElementById('exporterAddress').value = '4-85 NEWKIRK RD.\nRICHMOND HILL, ON L4C 3G4, CANADA';
  document.getElementById('exporterPhone').value = '+1 (416) 906-7878';
  
  // Consignee
  document.getElementById('consigneeName').value = 'DUTCH CAR CONNECTION';
  document.getElementById('consigneeAddress').value = '3 PUTSMOLENTJE, OSSENDRECHT, 4641 SK, NETHERLANDS';
  document.getElementById('consigneeContact').value = 'Tel: +850685526, Email: support@dutchcarconnection.com, EORI NO: NL859227716';
  
  // Notify Party
  document.getElementById('notifyParty').value = 'Same as Consignee';
  
  // Documents
  document.getElementById('docNumber').value = 'EBKG15426672';
  
  // Routing
  document.getElementById('pointOfOrigin').value = 'Montreal';
  document.getElementById('preCarriage').value = 'MSC';
  document.getElementById('exportingCarrier').value = 'MSC SAO PAULO V 06E03 / Montreal';
  document.getElementById('portOfLoading').value = 'Rotterdam';
  document.getElementById('portOfUnloading').value = 'Rotterdam';
  document.getElementById('placeOfDelivery').value = 'Montreal';
  document.getElementById('loadingTerminal').value = 'Viau';
  document.getElementById('typeOfMove').value = 'Vessel, Containerized';
  document.getElementById('containerized').value = 'Yes';
  
  // Container
  document.getElementById('containerNumber').value = 'MSNU5113592';
  document.getElementById('containerType').value = '40 Ft. High Cube';
  document.getElementById('sealNumber').value = '001147';
  
  // Clear existing vehicles and add 3 sample vehicles
  const container = document.getElementById('vehiclesContainer');
  container.innerHTML = '';
  
  const vehicles = [
    {
      vin: 'JN8AT3DD5MW302014',
      full: '2021 NISSAN ROGUE PLATINUM',
      weight: '1647.90'
    },
    {
      vin: '4JGDA5GB3JB146526',
      full: '2018 MERCEDES-BENZ GLE SUV GLE400 4MATIC',
      weight: '2235.00'
    },
    {
      vin: 'JM3TCBEY9N0608757',
      full: '2022 MAZDA CX-9 SIGNATURE',
      weight: '1999.89'
    }
  ];
  
  vehicles.forEach((v, i) => {
    if (i > 0) addVehicle();
    
    const rows = container.querySelectorAll('.vehicle-row');
    const row = rows[i];
    
    row.querySelector('.vehicle-vin').value = v.vin;
    row.querySelector('.vehicle-full').value = v.full;
    row.querySelector('.vehicle-weight').value = v.weight;
  });
  
  // Additional
  document.getElementById('placeDated').value = 'Laval';
  document.getElementById('freightService').value = 'Ocean Freight Service';
  document.getElementById('currency').value = 'USD';
  
  alert('✅ Sample data loaded successfully!');
}

// Generate PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Get form values
  const data = {
    exporter: {
      name: document.getElementById('exporterName').value,
      address: document.getElementById('exporterAddress').value,
      phone: document.getElementById('exporterPhone').value
    },
    consignee: {
      name: document.getElementById('consigneeName').value,
      address: document.getElementById('consigneeAddress').value,
      contact: document.getElementById('consigneeContact').value
    },
    notifyParty: document.getElementById('notifyParty').value,
    notifyAddress: document.getElementById('notifyAddress').value,
    docNumber: document.getElementById('docNumber').value,
    pointOfOrigin: document.getElementById('pointOfOrigin').value,
    preCarriage: document.getElementById('preCarriage').value,
    exportingCarrier: document.getElementById('exportingCarrier').value,
    portOfLoading: document.getElementById('portOfLoading').value,
    portOfUnloading: document.getElementById('portOfUnloading').value,
    placeOfDelivery: document.getElementById('placeOfDelivery').value,
    loadingTerminal: document.getElementById('loadingTerminal').value,
    typeOfMove: document.getElementById('typeOfMove').value,
    containerized: document.getElementById('containerized').value,
    containerNumber: document.getElementById('containerNumber').value,
    containerType: document.getElementById('containerType').value,
    sealNumber: document.getElementById('sealNumber').value,
    placeDated: document.getElementById('placeDated').value,
    bolDate: document.getElementById('bolDate').value,
    freightService: document.getElementById('freightService').value,
    currency: document.getElementById('currency').value
  };
  
  // Get vehicles
  const vehicleRows = document.querySelectorAll('.vehicle-row');
  const vehicles = [];
  vehicleRows.forEach(row => {
    vehicles.push({
      vin: row.querySelector('.vehicle-vin').value,
      full: row.querySelector('.vehicle-full').value,
      weight: parseFloat(row.querySelector('.vehicle-weight').value) || 0
    });
  });
  
  // Calculate totals
  const totalWeight = vehicles.reduce((sum, v) => sum + v.weight, 0);
  const totalWeightLbs = (totalWeight * 2.20462).toFixed(2);
  
  // PDF Layout
  let yPos = 10;
  
  // Header with Logo placeholder and Title
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('CIF CANADA', 10, 12);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('OCEAN SHIPPING AND FREIGHT FORWARDING', 10, 18);
  
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('BILL OF LADING', 150, 15);
  
  yPos = 30;
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  // Section 1: Exporter and Consignee (Side by side)
  doc.setFont(undefined, 'bold');
  doc.text('2. EXPORTER', 10, yPos);
  doc.text('5. DOCUMENT NUMBER', 110, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.exporter.name, 10, yPos);
  doc.text(data.docNumber, 110, yPos);
  
  yPos += 4;
  const exporterLines = doc.splitTextToSize(data.exporter.address, 90);
  doc.text(exporterLines, 10, yPos);
  
  doc.setFont(undefined, 'bold');
  doc.text('8. POINT OF ORIGIN', 110, yPos);
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.pointOfOrigin, 110, yPos);
  
  yPos = Math.max(yPos, 30 + exporterLines.length * 4 + 8);
  
  doc.text(data.exporter.phone, 10, yPos);
  
  yPos += 8;
  
  // Consignee
  doc.setFont(undefined, 'bold');
  doc.text('3. CONSIGNED TO', 10, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.consignee.name, 10, yPos);
  
  yPos += 4;
  const consigneeLines = doc.splitTextToSize(data.consignee.address, 90);
  doc.text(consigneeLines, 10, yPos);
  
  yPos = Math.max(yPos, yPos + consigneeLines.length * 4);
  yPos += 4;
  
  const contactLines = doc.splitTextToSize(data.consignee.contact, 90);
  doc.text(contactLines, 10, yPos);
  
  yPos = Math.max(yPos, yPos + contactLines.length * 4) + 8;
  
  // Notify Party
  doc.setFont(undefined, 'bold');
  doc.text('4. NOTIFY PARTY / INTERMEDIATE CONSIGNEE', 10, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.notifyParty, 10, yPos);
  
  yPos += 8;
  
  // Routing Information
  doc.setFont(undefined, 'bold');
  doc.text('12. PRE-CARRIAGE BY', 10, yPos);
  doc.text('14. EXPORTING CARRIER', 70, yPos);
  doc.text('10. LOADING PIER', 140, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.preCarriage, 10, yPos);
  doc.text(data.exportingCarrier, 70, yPos);
  doc.text(data.loadingTerminal, 140, yPos);
  
  yPos += 6;
  
  doc.setFont(undefined, 'bold');
  doc.text('15. PORT OF LOADING', 10, yPos);
  doc.text('16. PORT OF UNLOADING', 70, yPos);
  doc.text('11. TYPE OF MOVE', 140, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.portOfLoading, 10, yPos);
  doc.text(data.portOfUnloading, 70, yPos);
  doc.text(data.typeOfMove, 140, yPos);
  
  yPos += 6;
  
  doc.setFont(undefined, 'bold');
  doc.text('17. PLACE OF DELIVERY', 10, yPos);
  doc.text('11a. CONTAINERIZED', 140, yPos);
  
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.placeOfDelivery, 10, yPos);
  doc.text(data.containerized, 140, yPos);
  
  yPos += 8;
  
  // Container Information
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('CONTAINER INFORMATION:', 10, yPos);
  
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`CNT: ${data.containerNumber} ${data.containerType}`, 10, yPos);
  doc.text(`${totalWeight.toFixed(2)} Kg`, 150, yPos);
  
  yPos += 4;
  doc.text(`SEAL: ${data.sealNumber}`, 10, yPos);
  doc.text(`"${totalWeightLbs} Lb"`, 150, yPos);
  
  yPos += 6;
  
  // Vehicles Table
  const vehicleTableData = vehicles.map((v, i) => {
    const weightLbs = (v.weight * 2.20462).toFixed(2);
    
    return [
      `${i + 1} VEH`,
      `${v.full}\nVIN:${v.vin}`,
      `${v.weight.toFixed(2)} Kg\n"${weightLbs} Lb"`
    ];
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['QTY', 'DESCRIPTION OF COMMODITIES', 'GROSS WEIGHT']],
    body: vehicleTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 130 },
      2: { cellWidth: 40 }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 5;
  
  // Footer
  yPos += 5;
  doc.setFontSize(8);
  doc.text(data.freightService, 10, yPos);
  doc.text(data.currency, 180, yPos);
  
  yPos += 5;
  doc.text('PREPAID         COLLECT', 10, yPos);
  
  yPos += 10;
  
  // Date and Signature
  const dateFormatted = new Date(data.bolDate).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  doc.setFont(undefined, 'bold');
  doc.text('DATED AT', 10, yPos);
  doc.text(data.placeDated, 40, yPos);
  
  doc.text(dateFormatted, 150, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7);
  doc.text('By ________________________', 10, yPos);
  doc.text('AGENT FOR THE CARRIER', 80, yPos);
  
  yPos += 5;
  doc.text(`B/L No. ${data.docNumber}`, 150, yPos);
  
  // Legal Text
  yPos += 8;
  doc.setFontSize(6);
  const legalText = `Carrier has a policy against payment, solicitation, or receipt of any rebate, directly or indirectly, which would be unlawful under the United States Shipping Act, 1984 as amended.
DECLARED VALUE READ CLAUSE 29 HEREOF CONCERNING EXTRA FREIGHT AND CARRIER'S LIMITATION OF LIABILITY.

Received by the Carrier for shipment by ocean vessel between port of loading and port of discharge, and for arrangement or procurement pre-carriage from place of receipt and on-carriage to place of delivery, where stated above, the goods as specified above in apparent good order and condition unless otherwise stated. The goods to be delivered at the above mentioned port of discharge or place of delivery, whichever is applicable, subject always to the exceptions, limitations, conditions and liberties set out on the reverse side hereof, to which the Shipper and/or Consignee agree to accepting this Bill of Lading.

IN WITNESS WHEREOF three (3) original Bills of Lading have been signed, not otherwise stated above, one of which being accomplished the others shall be void.`;
  
  const legalLines = doc.splitTextToSize(legalText, 190);
  doc.text(legalLines, 10, yPos);
  
  // Save PDF
  const filename = `BOL_${data.docNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  alert(`✅ Bill of Lading PDF generated successfully!\nFilename: ${filename}`);
}
