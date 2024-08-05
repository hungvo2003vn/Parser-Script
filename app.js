const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')

const app = express()
const upload = multer({ dest: 'uploads/' })
app.use(cors())

const { parser_router } = require('./routers/index')
const PORT = 3000

app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'))
})

// Error handling middleware
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({
            message: 'Internal server error or your file is in the wrong format!'
        })
    } else {
        next()
    }
})

const clearUploads = () => {
    const uploadDir = path.join(__dirname, 'uploads')
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err)
            return
        }

        files.forEach(file => {
            const filePath = path.join(uploadDir, file)
            fs.unlink(filePath, err => {
                if (err) {
                    console.error('Error deleting file:', filePath, err)
                } else {
                    console.log('Deleted file:', filePath)
                }
            })
        })
    })
}

app.use('/api', upload.fields([{ name: 'config' }, { name: 'input' }]), parser_router, (req, res, next) => {
    clearUploads()
    next()
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
