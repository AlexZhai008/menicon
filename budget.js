/* ============================================================
   Menicon Life — Budget Management Logic
   ============================================================ */

let budgetData = { total: 0, spent: 0, records: [] };
let allRecords = [];
let currentUser = null;

// ==================== INIT ====================
(async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  document.getElementById('userBadge').textContent = '👤 管理员';

  // Set default date
  document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

  await loadBudgetSettings();
  await loadRecords();
})();

// ==================== LOAD DATA ====================
async function loadBudgetSettings() {
  const year = new Date().getFullYear();
  const { data, error } = await supabase
    .from('budget_settings')
    .select('*')
    .eq('year', year)
    .single();

  if (error || !data) {
    budgetData.total = 0;
  } else {
    budgetData.total = parseFloat(data.total_budget);
  }
}

async function loadRecords() {
  const { data, error } = await supabase
    .from('budget_records')
    .select('*')
    .order('record_date', { ascending: false });

  if (error) {
    showToast('加载支出记录失败: ' + error.message, 'error');
    return;
  }

  allRecords = data || [];
  budgetData.spent = allRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  budgetData.records = allRecords;

  renderStats();
  renderProgressBar();
  renderCategories();
  filterRecords();
}

// ==================== RENDER ====================
function renderStats() {
  const remaining = budgetData.total - budgetData.spent;
  const usage = budgetData.total > 0 ? (budgetData.spent / budgetData.total * 100) : 0;

  document.getElementById('statBudget').textContent = formatCurrency(budgetData.total);
  document.getElementById('statSpent').textContent = formatCurrency(budgetData.spent);
  document.getElementById('statRemaining').textContent = formatCurrency(remaining);
  document.getElementById('statUsage').textContent = usage.toFixed(1) + '%';
}

function renderProgressBar() {
  const usage = budgetData.total > 0 ? Math.min((budgetData.spent / budgetData.total * 100), 100) : 0;
  const remaining = budgetData.total - budgetData.spent;

  const fill = document.getElementById('budgetProgressFill');
  fill.style.width = usage + '%';

  if (usage > 90) fill.style.background = 'var(--color-danger)';
  else if (usage > 70) fill.style.background = 'var(--color-warning)';
  else fill.style.background = 'linear-gradient(90deg, var(--color-accent), #e8c97a)';

  document.getElementById('progressPercent').textContent = usage.toFixed(1) + '%';
  document.getElementById('progressRemaining').textContent = '剩余 ' + formatCurrency(remaining);
}

function renderCategories() {
  const categories = {};
  allRecords.forEach(r => {
    const cat = r.category || '其他';
    categories[cat] = (categories[cat] || 0) + parseFloat(r.amount);
  });

  const grid = document.getElementById('categoryGrid');
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    grid.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--color-text-muted);">暂无支出数据</div>';
    return;
  }

  const catIcons = {
    '营销推广': '📢', '物料采购': '📦', '活动费用': '🎪',
    '办公开支': '🏢', '其他': '📋'
  };

  grid.innerHTML = entries.map(([cat, amount]) => {
    const percent = budgetData.spent > 0 ? (amount / budgetData.spent * 100).toFixed(1) : 0;
    return `
      <div class="category-card">
        <div class="category-card__icon">${catIcons[cat] || '📋'}</div>
        <div class="category-card__info">
          <div class="category-card__name">${cat}</div>
          <div class="category-card__amount">${formatCurrency(amount)}</div>
        </div>
        <div class="category-card__percent">${percent}%</div>
      </div>
    `;
  }).join('');
}

function filterRecords() {
  const filter = document.getElementById('categoryFilter').value;
  let filtered = allRecords;
  if (filter !== 'all') {
    filtered = allRecords.filter(r => r.category === filter);
  }
  renderRecords(filtered);
}

function renderRecords(records) {
  const tbody = document.getElementById('expenseBody');
  if (!records || records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">暂无记录</td></tr>';
    return;
  }

  tbody.innerHTML = records.map(r => `
    <tr>
      <td>${formatDate(r.record_date)}</td>
      <td><strong>${r.title}</strong></td>
      <td><span class="category-tag">${r.category}</span></td>
      <td class="amount-cell">${formatCurrency(r.amount)}</td>
      <td>${r.note || '-'}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" title="编辑" onclick="editExpense('${r.id}')">✏️</button>
          <button class="btn-icon btn-icon--danger" title="删除" onclick="deleteExpense('${r.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ==================== EXPENSE MODAL ====================
function openExpenseModal() {
  document.getElementById('expenseModalTitle').textContent = '新增支出';
  document.getElementById('expenseId').value = '';
  document.getElementById('expenseTitle').value = '';
  document.getElementById('expenseAmount').value = '';
  document.getElementById('expenseCategory').value = '营销推广';
  document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('expenseNote').value = '';
  document.getElementById('expenseModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExpenseModal() {
  document.getElementById('expenseModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('expenseModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeExpenseModal();
});

function editExpense(id) {
  const record = allRecords.find(r => r.id === id);
  if (!record) return;

  document.getElementById('expenseModalTitle').textContent = '编辑支出';
  document.getElementById('expenseId').value = record.id;
  document.getElementById('expenseTitle').value = record.title;
  document.getElementById('expenseAmount').value = record.amount;
  document.getElementById('expenseCategory').value = record.category;
  document.getElementById('expenseDate').value = record.record_date;
  document.getElementById('expenseNote').value = record.note || '';
  document.getElementById('expenseModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function submitExpense() {
  const id = document.getElementById('expenseId').value;
  const title = document.getElementById('expenseTitle').value.trim();
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const category = document.getElementById('expenseCategory').value;
  const record_date = document.getElementById('expenseDate').value;
  const note = document.getElementById('expenseNote').value.trim();

  if (!title) { showToast('请输入项目名称', 'error'); return; }
  if (!amount || amount <= 0) { showToast('请输入有效金额', 'error'); return; }
  if (!record_date) { showToast('请选择日期', 'error'); return; }

  const record = { title, amount, category, record_date, note, user_email: currentUser.email };

  if (id) {
    // Update existing
    const { error } = await supabase
      .from('budget_records')
      .update(record)
      .eq('id', id);
    if (error) { showToast('更新失败: ' + error.message, 'error'); return; }
    showToast('支出记录已更新');
  } else {
    // Insert new
    const { error } = await supabase
      .from('budget_records')
      .insert(record);
    if (error) { showToast('添加失败: ' + error.message, 'error'); return; }
    showToast('支出记录已添加');
  }

  closeExpenseModal();
  await loadRecords();
}

async function deleteExpense(id) {
  if (!confirm('确定要删除这条记录吗？')) return;

  const { error } = await supabase
    .from('budget_records')
    .delete()
    .eq('id', id);

  if (error) {
    showToast('删除失败: ' + error.message, 'error');
    return;
  }

  showToast('记录已删除');
  await loadRecords();
}

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeExpenseModal();
});
