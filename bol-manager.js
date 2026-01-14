// BOL Manager with Save/Edit/Delete functionality
let savedBOLs = JSON.parse(localStorage.getItem('cifBOLs')) || [];
let currentEditingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('bolDate').value = new Date().toISOString().split('T')[0];
  addVehicle(); // Add first vehicle
  loadSavedBOLs();
  updateBOLCount();
});

// Tab switching
function switchTab(tab) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  if (tab === 'create') {
    document.querySelectorAll('.tab-button')[0].classList.add('active');
    document.getElementById('createTab').classList.add('active');
  } else {
    document.querySelectorAll('.tab-button')[1].classList.add('active');
    document.getElementById('savedTab').classList.add('active');
    loadSavedBOLs();
  }
}

// Add vehicle
function addVehicle() {
  const container = document.getElementById('vehiclesContainer');
  const count = container.children.length + 1;
  const html = `
    <div class="vehicle-row">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-gray-700">Vehicle ${count}</h3>
        <button type="button" onclick="removeVehicle(this)" class="text-red-600 hover:text-red-800 font-bold">✕</button>
      </div>
      <div><label class="form-label">VIN</label><input type="text" class="form-input vehicle-vin" placeholder="JN8AT3DD5MW302014"></div>
      <div class="mt-3"><label class="form-label">Year / Make / Model</label><input type="text" class="form-input vehicle-full" placeholder="2021 NISSAN ROGUE"></div>
      <div class="mt-3"><label class="form-label">Weight (Kg)</label><input type="number" step="0.01" class="form-input vehicle-weight" placeholder="1647.90"></div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
}

function removeVehicle(btn) {
  const container = document.getElementById('vehiclesContainer');
  if (container.children.length > 1) btn.closest('.vehicle-row').remove();
  else alert('At least one vehicle required!');
}

// Get form data
function getFormData() {
  const vehicleRows = document.querySelectorAll('.vehicle-row');
  const vehicles = [];
  vehicleRows.forEach(row => {
    vehicles.push({
      vin: row.querySelector('.vehicle-vin').value,
      full: row.querySelector('.vehicle-full').value,
      weight: parseFloat(row.querySelector('.vehicle-weight').value) || 0
    });
  });
  
  return {
    id: currentEditingId || Date.now().toString(),
    docNumber: document.getElementById('docNumber').value,
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
    currency: document.getElementById('currency').value,
    vehicles: vehicles,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Save BOL
function saveBOL() {
  const data = getFormData();
  
  if (!data.docNumber) {
    alert('⚠️ Document Number is required!');
    return;
  }
  
  if (currentEditingId) {
    // Update existing
    const index = savedBOLs.findIndex(b => b.id === currentEditingId);
    if (index !== -1) {
      savedBOLs[index] = data;
      alert('✅ BOL updated successfully!');
    }
  } else {
    // Save new
    savedBOLs.push(data);
    alert('✅ BOL saved successfully!');
  }
  
  localStorage.setItem('cifBOLs', JSON.stringify(savedBOLs));
  updateBOLCount();
  cancelEdit();
  switchTab('saved');
}

// Load saved BOLs
function loadSavedBOLs() {
  const container = document.getElementById('savedBOLsList');
  
  if (savedBOLs.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No saved BOLs yet. Create one to get started!</p>';
    return;
  }
  
  const html = savedBOLs.map(bol => `
    <div class="bol-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-blue-900">📄 ${bol.docNumber}</h3>
          <p class="text-sm text-gray-600 mt-1">
            <strong>From:</strong> ${bol.exporter.name} → <strong>To:</strong> ${bol.consignee.name}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Route:</strong> ${bol.portOfLoading} → ${bol.placeOfDelivery} | 
            <strong>Vehicles:</strong> ${bol.vehicles.length}
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Created: ${new Date(bol.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div class="flex gap-2">
          <button onclick="editBOL('${bol.id}')" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">✏️ Edit</button>
          <button onclick="generatePDFFromSaved('${bol.id}')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">📄 PDF</button>
          <button onclick="deleteBOL('${bol.id}')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Edit BOL
function editBOL(id) {
  const bol = savedBOLs.find(b => b.id === id);
  if (!bol) return;
  
  currentEditingId = id;
  
  // Fill form
  document.getElementById('docNumber').value = bol.docNumber;
  document.getElementById('exporterName').value = bol.exporter.name;
  document.getElementById('exporterAddress').value = bol.exporter.address;
  document.getElementById('exporterPhone').value = bol.exporter.phone;
  document.getElementById('consigneeName').value = bol.consignee.name;
  document.getElementById('consigneeAddress').value = bol.consignee.address;
  document.getElementById('consigneeContact').value = bol.consignee.contact;
  document.getElementById('notifyParty').value = bol.notifyParty;
  document.getElementById('pointOfOrigin').value = bol.pointOfOrigin;
  document.getElementById('preCarriage').value = bol.preCarriage;
  document.getElementById('exportingCarrier').value = bol.exportingCarrier;
  document.getElementById('portOfLoading').value = bol.portOfLoading;
  document.getElementById('portOfUnloading').value = bol.portOfUnloading;
  document.getElementById('placeOfDelivery').value = bol.placeOfDelivery;
  document.getElementById('loadingTerminal').value = bol.loadingTerminal;
  document.getElementById('typeOfMove').value = bol.typeOfMove;
  document.getElementById('containerized').value = bol.containerized;
  document.getElementById('containerNumber').value = bol.containerNumber;
  document.getElementById('containerType').value = bol.containerType;
  document.getElementById('sealNumber').value = bol.sealNumber;
  document.getElementById('placeDated').value = bol.placeDated;
  document.getElementById('bolDate').value = bol.bolDate;
  document.getElementById('freightService').value = bol.freightService;
  document.getElementById('currency').value = bol.currency;
  
  // Vehicles
  const container = document.getElementById('vehiclesContainer');
  container.innerHTML = '';
  bol.vehicles.forEach((v, i) => {
    if (i > 0) addVehicle();
    const rows = container.querySelectorAll('.vehicle-row');
    rows[i].querySelector('.vehicle-vin').value = v.vin;
    rows[i].querySelector('.vehicle-full').value = v.full;
    rows[i].querySelector('.vehicle-weight').value = v.weight;
  });
  
  // Show editing indicator
  document.getElementById('editingIndicator').classList.remove('hidden');
  document.getElementById('editingBOLNumber').textContent = bol.docNumber;
  
  switchTab('create');
}

// Cancel edit
function cancelEdit() {
  currentEditingId = null;
  document.getElementById('editingIndicator').classList.add('hidden');
  clearForm();
}

// Delete BOL
function deleteBOL(id) {
  if (confirm('Are you sure you want to delete this BOL?')) {
    savedBOLs = savedBOLs.filter(b => b.id !== id);
    localStorage.setItem('cifBOLs', JSON.stringify(savedBOLs));
    loadSavedBOLs();
    updateBOLCount();
    alert('✅ BOL deleted!');
  }
}

// Generate PDF from saved
function generatePDFFromSaved(id) {
  const bol = savedBOLs.find(b => b.id === id);
  if (!bol) return;
  generatePDFFromData(bol);
}

// Update BOL count
function updateBOLCount() {
  document.getElementById('bolCount').textContent = savedBOLs.length;
}

// Filter BOLs
function filterBOLs() {
  const search = document.getElementById('searchBOL').value.toLowerCase();
  const filtered = savedBOLs.filter(bol => 
    bol.docNumber.toLowerCase().includes(search) ||
    bol.consignee.name.toLowerCase().includes(search) ||
    bol.exporter.name.toLowerCase().includes(search)
  );
  
  const container = document.getElementById('savedBOLsList');
  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No BOLs match your search.</p>';
    return;
  }
  
  const html = filtered.map(bol => `
    <div class="bol-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-blue-900">📄 ${bol.docNumber}</h3>
          <p class="text-sm text-gray-600 mt-1"><strong>From:</strong> ${bol.exporter.name} → <strong>To:</strong> ${bol.consignee.name}</p>
          <p class="text-sm text-gray-600"><strong>Route:</strong> ${bol.portOfLoading} → ${bol.placeOfDelivery} | <strong>Vehicles:</strong> ${bol.vehicles.length}</p>
          <p class="text-xs text-gray-500 mt-2">Created: ${new Date(bol.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="flex gap-2">
          <button onclick="editBOL('${bol.id}')" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">✏️</button>
          <button onclick="generatePDFFromSaved('${bol.id}')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">📄</button>
          <button onclick="deleteBOL('${bol.id}')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
  container.innerHTML = html;
}

// Clear form
function clearForm() {
  document.getElementById('bolForm').reset();
  document.getElementById('bolDate').value = new Date().toISOString().split('T')[0];
  const container = document.getElementById('vehiclesContainer');
  container.innerHTML = '';
  addVehicle();
  currentEditingId = null;
  document.getElementById('editingIndicator').classList.add('hidden');
}

// Load sample
function loadSample() {
  document.getElementById('exporterName').value = 'ROSS AUTO SALES';
  document.getElementById('exporterAddress').value = '4-85 NEWKIRK RD.\nRICHMOND HILL, ON L4C 3G4, CANADA';
  document.getElementById('exporterPhone').value = '+1 (416) 906-7878';
  document.getElementById('consigneeName').value = 'DUTCH CAR CONNECTION';
  document.getElementById('consigneeAddress').value = '3 PUTSMOLENTJE, OSSENDRECHT, 4641 SK, NETHERLANDS';
  document.getElementById('consigneeContact').value = 'Tel: +850685526';
  document.getElementById('notifyParty').value = 'Same as Consignee';
  document.getElementById('docNumber').value = 'EBKG15426672';
  document.getElementById('pointOfOrigin').value = 'Montreal';
  document.getElementById('preCarriage').value = 'MSC';
  document.getElementById('exportingCarrier').value = 'MSC SAO PAULO V 06E03';
  document.getElementById('portOfLoading').value = 'Rotterdam';
  document.getElementById('portOfUnloading').value = 'Rotterdam';
  document.getElementById('placeOfDelivery').value = 'Montreal';
  document.getElementById('loadingTerminal').value = 'Viau';
  document.getElementById('containerNumber').value = 'MSNU5113592';
  document.getElementById('containerType').value = '40 Ft. High Cube';
  document.getElementById('sealNumber').value = '001147';
  document.getElementById('placeDated').value = 'Laval';
  document.getElementById('freightService').value = 'Ocean Freight Service';
  
  const container = document.getElementById('vehiclesContainer');
  container.innerHTML = '';
  const vehicles = [
    { vin: 'JN8AT3DD5MW302014', full: '2021 NISSAN ROGUE PLATINUM', weight: '1647.90' },
    { vin: '4JGDA5GB3JB146526', full: '2018 MERCEDES-BENZ GLE SUV GLE400', weight: '2235.00' },
    { vin: 'JM3TCBEY9N0608757', full: '2022 MAZDA CX-9 SIGNATURE', weight: '1999.89' }
  ];
  
  vehicles.forEach((v, i) => {
    if (i > 0) addVehicle();
    const rows = container.querySelectorAll('.vehicle-row');
    rows[i].querySelector('.vehicle-vin').value = v.vin;
    rows[i].querySelector('.vehicle-full').value = v.full;
    rows[i].querySelector('.vehicle-weight').value = v.weight;
  });
}

// Generate PDF
function generatePDF() {
  const data = getFormData();
  generatePDFFromData(data);
}

function generatePDFFromData(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const totalWeight = data.vehicles.reduce((sum, v) => sum + v.weight, 0);
  const totalWeightLbs = (totalWeight * 2.20462).toFixed(2);
  
  let yPos = 10;
  
  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('CIF CANADA', 10, 12);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('OCEAN SHIPPING', 10, 18);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('BILL OF LADING', 150, 15);
  
  yPos = 30;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  // Content sections (simplified for space)
  doc.setFont(undefined, 'bold');
  doc.text('EXPORTER', 10, yPos);
  doc.text('DOC NUMBER', 110, yPos);
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.exporter.name, 10, yPos);
  doc.text(data.docNumber, 110, yPos);
  yPos += 8;
  
  doc.setFont(undefined, 'bold');
  doc.text('CONSIGNEE', 10, yPos);
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(data.consignee.name, 10, yPos);
  yPos += 10;
  
  // Container info
  doc.setFont(undefined, 'bold');
  doc.text('CONTAINER:', 10, yPos);
  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.text(`${data.containerNumber} ${data.containerType}`, 10, yPos);
  doc.text(`${totalWeight.toFixed(2)} Kg`, 150, yPos);
  yPos += 4;
  doc.text(`SEAL: ${data.sealNumber}`, 10, yPos);
  doc.text(`"${totalWeightLbs} Lb"`, 150, yPos);
  yPos += 8;
  
  // Vehicles table
  const vehicleTableData = data.vehicles.map((v, i) => {
    const weightLbs = (v.weight * 2.20462).toFixed(2);
    return [`${i + 1} VEH`, `${v.full}\nVIN:${v.vin}`, `${v.weight.toFixed(2)} Kg\n"${weightLbs} Lb"`];
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['QTY', 'DESCRIPTION', 'WEIGHT']],
    body: vehicleTableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 130 }, 2: { cellWidth: 40 } }
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Footer
  doc.setFontSize(8);
  doc.text(data.freightService, 10, yPos);
  doc.text(data.currency, 180, yPos);
  yPos += 10;
  doc.text(`DATED AT ${data.placeDated}`, 10, yPos);
  doc.text(new Date(data.bolDate).toLocaleDateString(), 150, yPos);
  
  doc.save(`BOL_${data.docNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
  alert('✅ PDF generated!');
}
