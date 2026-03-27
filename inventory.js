/* ============================================================
   Menicon Life — Inventory Management Logic
   ============================================================ */

let inventoryData = [];
let currentUser = null;

// ==================== INIT ====================
(async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  document.getElementById('userBadge').textContent = '👤 管理员';
  await loadInventory();
  await loadLogs();
})();

// ==================== LOAD DATA ====================
async function loadInventory() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    showToast('加载库存数据失败: ' + error.message, 'error');
    return;
  }

  inventoryData = data;
  renderInventory();
  renderStats();
}

async function loadLogs() {
  const { data, error } = await supabase
    .from('inventory_logs')
    .select('*, inventory(product_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    showToast('加载变动记录失败: ' + error.message, 'error');
    return;
  }

  renderLogs(data);
}

// ==================== RENDER ====================
function renderStats() {
  document.getElementById('statTotal').textContent = inventoryData.length;
  document.getElementById('statAvailable').textContent = inventoryData.filter(p => p.status === 'available').length;
  document.getElementById('statLow').textContent = inventoryData.filter(p => p.status === 'low').length;
  document.getElementById('statOut').textContent = inventoryData.filter(p => p.status === 'out').length;
}

function renderInventory() {
  const tbody = document.getElementById('inventoryBody');
  if (inventoryData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">暂无数据</td></tr>';
    return;
  }

  tbody.innerHTML = inventoryData.map(p => {
    const statusMap = {
      available: { label: '充足', cls: 'status--available' },
      low: { label: '紧张', cls: 'status--low' },
      out: { label: '售罄', cls: 'status--out' }
    };
    const s = statusMap[p.status] || statusMap.available;

    return `
      <tr>
        <td>
          <div class="table-product">
            <img src="${p.image_url}" alt="${p.product_name}" class="table-product__img" />
            <span>${p.product_name}</span>
          </div>
        </td>
        <td><code>${p.sku}</code></td>
        <td><strong>${p.quantity}</strong></td>
        <td><span class="status-badge ${s.cls}">${s.label}</span></td>
        <td>
          <button class="btn btn--primary btn--sm" onclick="openStockModal('${p.id}', '${p.product_name}')">
            增减库存
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderLogs(logs) {
  const tbody = document.getElementById('logsBody');
  if (!logs || logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">暂无变动记录</td></tr>';
    return;
  }

  tbody.innerHTML = logs.map(log => {
    const isIn = log.change_type === 'in';
    return `
      <tr>
        <td>${formatDate(log.created_at)}</td>
        <td>${log.inventory ? log.inventory.product_name : '-'}</td>
        <td><span class="status-badge ${isIn ? 'status--available' : 'status--out'}">${isIn ? '入库' : '出库'}</span></td>
        <td><strong>${isIn ? '+' : '-'}${log.quantity}</strong></td>
        <td>${log.note || '-'}</td>
        <td>${log.user_email || '-'}</td>
      </tr>
    `;
  }).join('');
}

// ==================== STOCK MODAL ====================
function openStockModal(productId, productName) {
  document.getElementById('stockProductId').value = productId;
  document.getElementById('stockModalTitle').textContent = `库存操作 — ${productName}`;
  document.getElementById('stockQuantity').value = 1;
  document.getElementById('stockNote').value = '';
  document.querySelector('input[name="stockType"][value="in"]').checked = true;
  document.getElementById('stockModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStockModal() {
  document.getElementById('stockModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('stockModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeStockModal();
});

async function submitStockChange() {
  const productId = document.getElementById('stockProductId').value;
  const changeType = document.querySelector('input[name="stockType"]:checked').value;
  const quantity = parseInt(document.getElementById('stockQuantity').value);
  const note = document.getElementById('stockNote').value;

  if (!quantity || quantity < 1) {
    showToast('请输入有效数量', 'error');
    return;
  }

  // Find current product
  const product = inventoryData.find(p => p.id === productId);
  if (!product) return;

  // Calculate new quantity
  let newQuantity = changeType === 'in' ? product.quantity + quantity : product.quantity - quantity;
  if (newQuantity < 0) {
    showToast('出库数量不能超过当前库存', 'error');
    return;
  }

  // Determine new status
  let newStatus = 'available';
  if (newQuantity === 0) newStatus = 'out';
  else if (newQuantity <= 50) newStatus = 'low';

  // Update inventory
  const { error: updateErr } = await supabase
    .from('inventory')
    .update({ quantity: newQuantity, status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (updateErr) {
    showToast('操作失败: ' + updateErr.message, 'error');
    return;
  }

  // Insert log
  const { error: logErr } = await supabase
    .from('inventory_logs')
    .insert({
      product_id: productId,
      change_type: changeType,
      quantity: quantity,
      note: note,
      user_email: currentUser.email
    });

  if (logErr) {
    showToast('记录变动失败: ' + logErr.message, 'error');
  }

  showToast(`${changeType === 'in' ? '入库' : '出库'}成功！${changeType === 'in' ? '+' : '-'}${quantity}`);
  closeStockModal();
  await loadInventory();
  await loadLogs();
}

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeStockModal();
});
