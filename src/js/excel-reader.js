class ExcelReader {
    constructor() {
        this.data = null;
    }

    async readFileFromPath(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            console.log('Sheet name:', firstSheetName);
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                dateNF: 'dd/mm/yyyy'
            });
            console.log('Raw JSON data from Excel:', jsonData);
            console.log('Total rows in raw data:', jsonData.length);

            this.data = this.processData(jsonData);
            return this.data;
        } catch (error) {
            throw new Error(`Error reading Excel file: ${error.message}`);
        }
    }

    processData(rawData) {
        console.log('Processing raw data:', rawData);

        if (rawData.length === 0) {
            console.log('No data found in Excel file');
            return { headers: [], rows: [] };
        }

        const headers = rawData[0];
        console.log('Headers found:', headers);

        const rows = rawData.slice(1).filter(row => {
            const hasData = row.some(cell => cell !== undefined && cell !== '' && cell !== null);
            return hasData;
        }).map(row => {
            return row.map(cell => {
                if (typeof cell === 'number' && cell > 40000 && cell < 50000) {
                    const excelEpoch = new Date(1900, 0, 1);
                    const jsDate = new Date(excelEpoch.getTime() + (cell - 2) * 24 * 60 * 60 * 1000);
                    return jsDate.toLocaleDateString('en-GB');
                }
                return cell;
            });
        });

        console.log('Filtered and formatted rows:', rows);
        console.log('Final row count:', rows.length);

        return { headers, rows };
    }
}