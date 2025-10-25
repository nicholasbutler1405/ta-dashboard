# TA Dashboard

## Project Overview
The TA Dashboard is a web application designed to read and display information from an Excel file named "TA List.xlsx". The dashboard provides a user-friendly interface to visualize the data contained in the spreadsheet.

## Project Structure
```
ta-dashboard
├── src
│   ├── index.html          # Main HTML document for the dashboard
│   ├── css
│   │   └── styles.css      # Styles for the dashboard
│   ├── js
│   │   ├── main.js         # Entry point for JavaScript functionality
│   │   ├── excel-reader.js  # Functions to read data from the Excel file
│   │   └── dashboard.js     # Functions to display the data on the dashboard
│   └── data
│       └── TA List.xlsx     # Excel spreadsheet containing the data
├── package.json             # Configuration file for npm
└── README.md                # Documentation for the project
```

## Setup Instructions
1. **Clone the Repository**
   Clone this repository to your local machine using:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory**
   ```
   cd ta-dashboard
   ```

3. **Install Dependencies**
   Run the following command to install the necessary packages:
   ```
   npm install
   ```

4. **Open the Dashboard**
   Open `src/index.html` in your web browser to view the dashboard.

## Functionality
- The dashboard reads data from "TA List.xlsx" using the `excel-reader.js` file.
- The data is processed and displayed dynamically using the `dashboard.js` file.
- The layout and design are handled by the `styles.css` file.

## Libraries Used
- [SheetJS](https://sheetjs.com/) for reading Excel files.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.