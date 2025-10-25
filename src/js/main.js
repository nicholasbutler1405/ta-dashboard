document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, starting dashboard...');

    const excelReader = new ExcelReader();
    const dashboard = new Dashboard('data-container');

    const filePath = 'data/TAList.xlsx';
    console.log('Attempting to load:', filePath);

    try {
        console.log('Calling readFileFromPath...');
        const data = await excelReader.readFileFromPath(filePath);
        console.log('Data loaded successfully:', data);
        dashboard.renderDashboard(data);
    } catch (error) {
        console.error('Error details:', error);
        dashboard.showError(`Failed to load TAList.xlsx: ${error.message}`);
    }
});