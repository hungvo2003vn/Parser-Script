const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

const readFile = (req, res, next) => {
    try {
        const configFilePath = req.files['config'][0].path
        const inputFilePath = req.files['input'][0].path

        // Read the XLSX config file
        const configWorkbook = xlsx.readFile(configFilePath)
        const configSheetName = configWorkbook.SheetNames[0]
        const configWorksheet = configWorkbook.Sheets[configSheetName]
        const configJson = xlsx.utils.sheet_to_json(configWorksheet)

        // Read the TXT input file
        const inputTxt = fs.readFileSync(inputFilePath, 'utf8')

        // Example parseData function
        const data = parseData(configJson, inputTxt)

        // Remove the uploaded files after reading
        fs.unlinkSync(configFilePath)
        fs.unlinkSync(inputFilePath)

        res.status(200).json({ data })

    } catch (error) {
        next(error)
    }
}

const parseData = (configData, inputData) => {
    // Parse the configuration data
    const configs = parseConfig(configData)

    // Split the input data into lines
    const lines = inputData.split('\n').filter(line => line.length > 0)

    const length = lines.length
    const parsedHeader = parseLine(lines[0], configs.headers)
    const parsedDetail = lines.slice(1, length - 1).map(line => parseLine(line.slice(1, length), configs.details))
    const parsedFooter = parseLine(lines[length - 1], configs.footers)

    return {
        HEADER: parsedHeader,
        DETAIL: parsedDetail,
        FOOTER: parsedFooter
    }
}

const parseLine = (line, config) => {
    const parsedLine = {}
    config.forEach(field => {
        const value = line.substring(field.Start - 1, field.End).trim()
        parsedLine[field.Field] = value
    })
    return parsedLine
}

const parseConfig = (data, options) => {

    let rawHeaders = []
    let rawDetails = []
    let rawFooters = []

    data.forEach(item => {
        if(item.Table === 'HEADER') {
            rawHeaders.push(item)
        } else if(item.Table === 'DETAIL') {
            rawDetails.push(item)
        } else if (item.Table === 'FOOTER') {
            rawFooters.push(item)
        }
    })

    return {
        headers: rawHeaders,
        details: rawDetails,
        footers: rawFooters
    }
}

module.exports = {
    readFile
}