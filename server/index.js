const express = require("express")
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const { readdir } = require('node:fs/promises');

const app = express()
app.use(cors())
app.use(express.json({ limit: '500kb', parameterLimit: 10000 }))

async function scanner(paths, results = []) {
    const directoryPath = path.join(__dirname, ...paths)

    let files = []

    try {
        files = await readdir(directoryPath)
    } catch(e) {
        console.log(e)
    }

    files.forEach(file => {
        const splitted = file.split('.')
        
        if(splitted.length > 1) {
            paths.push(file)
            results.push({
                name: file,
                file: splitted[1],
                isFolder: false,
                fullPath: path.join(__dirname, ...paths)
            })
            paths.pop()
        } else {
            results.push({
                name: splitted[0],
                children: [],
                path: splitted[0],
                isFolder: true
            })
        }
    })

    let hasMoreFolders = false
    for(let i = 0; i < results.length; i++) {
        if(results[i].isFolder && !hasMoreFolders) {
            paths.push(results[i].path)
            hasMoreFolders = true
            results[i].children = await scanner(paths)
        } else if (hasMoreFolders && results[i].isFolder) {
            paths.pop()
            paths.push(results[i].path)
            results[i].children = await scanner(paths)
        }
    }

    return results
}



app.get('/get-folder', async(req, res) => {
    const result = await scanner(['test-folder'])

    res.json({result})
})

app.post('/file', async (req, res) => {
    const { fullPath } = req.body

    res.send(fs.readFileSync(fullPath))
})

app.listen(8888, () => {
    console.log()
    console.log(`Server start on localhost:8888`)
    console.log()
})