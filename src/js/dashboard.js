class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.rawData = null;
    }

    showLoading(message = 'Loading...') {
        this.container.innerHTML = `<p class="loading">${message}</p>`;
    }

    showError(message) {
        this.container.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    }

    renderDashboard(data) {
        this.rawData = data;

        if (!data || !data.headers || !data.rows) {
            this.showError('No data to display');
            return;
        }

        const dateIndex = data.headers.findIndex(header =>
            header && header.toLowerCase().includes('date') && header.toLowerCase().includes('approved')
        );
        const locationIndex = data.headers.findIndex(header =>
            header && header.toLowerCase().includes('location')
        );

        if (dateIndex === -1 || locationIndex === -1) {
            this.showError('Could not find "Date Approved" or "Location" columns in the data');
            return;
        }

        const categorizedData = this.categorizeByDate(data.rows, dateIndex, locationIndex);

        this.renderColumns(categorizedData);
    }

    categorizeByDate(rows, dateIndex, locationIndex) {
        const now = new Date();
        const categories = {
            green: [],
            amber: [],
            red: []
        };

        rows.forEach((row, index) => {
            const dateStr = row[dateIndex];
            const location = row[locationIndex];

            if (!dateStr || !location) return;

            const dateParts = dateStr.toString().split('/');
            if (dateParts.length !== 3) return;

            const approvedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            const yearsDiff = (now - approvedDate) / (1000 * 60 * 60 * 24 * 365.25);

            const item = {
                location: location,
                dateApproved: dateStr,
                yearsDiff: yearsDiff.toFixed(1),
                rowIndex: index,
                fullData: row
            };

            if (yearsDiff <= 1.5) {
                categories.green.push(item);
            } else if (yearsDiff <= 2) {
                categories.amber.push(item);
            } else {
                categories.red.push(item);
            }
        });

        return categories;
    }

    renderColumns(categorizedData) {
        this.container.innerHTML = `
            <div class="dashboard-columns">
                <div class="column green-column">
                    <h2>Recent Approvals</h2>
                    <div class="location-list" id="green-list"></div>
                </div>
                <div class="column amber-column">
                    <h2>Approaching Deadline</h2>
                    <div class="location-list" id="amber-list"></div>
                </div>
                <div class="column red-column">
                    <h2>Approval Lapsed</h2>
                    <div class="location-list" id="red-list"></div>
                </div>
            </div>
            <div id="detail-view" style="display: none;">
                <h3>Scheme Details</h3>
                <button id="back-button">← Back to Dashboard</button>
                <div id="detail-content"></div>
            </div>
        `;

        this.populateColumn('green-list', categorizedData.green);
        this.populateColumn('amber-list', categorizedData.amber);
        this.populateColumn('red-list', categorizedData.red);

        document.getElementById('back-button').addEventListener('click', () => {
            this.showDashboard();
        });
    }

    populateColumn(elementId, items) {
        const container = document.getElementById(elementId);

        if (items.length === 0) {
            container.innerHTML = '<p class="no-items">No items in this category</p>';
            return;
        }

        items.forEach(item => {
            const locationDiv = document.createElement('div');
            locationDiv.className = 'location-item';
            locationDiv.innerHTML = `
                <div class="location-name">${item.location}</div>
                <div class="location-date">Approved: ${item.dateApproved}</div>
                <div class="location-age">${item.yearsDiff} years ago</div>
            `;

            locationDiv.addEventListener('click', () => {
                this.showLocationDetails(item);
            });

            container.appendChild(locationDiv);
        });
    }

    showLocationDetails(item) {
        const detailView = document.getElementById('detail-view');
        const dashboardColumns = document.querySelector('.dashboard-columns');
        const detailContent = document.getElementById('detail-content');

        dashboardColumns.style.display = 'none';
        detailView.style.display = 'block';

        const table = document.createElement('table');
        table.className = 'detail-table';

        const tbody = document.createElement('tbody');

        this.rawData.headers.forEach((header, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="detail-label">${header}</td>
                <td class="detail-value">${item.fullData[index] || ''}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        detailContent.innerHTML = '';
        detailContent.appendChild(table);
    }

    showDashboard() {
        const detailView = document.getElementById('detail-view');
        const dashboardColumns = document.querySelector('.dashboard-columns');

        detailView.style.display = 'none';
        dashboardColumns.style.display = 'flex';
    }
}