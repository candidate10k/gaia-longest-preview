'use strict'

const express = require('express')
const router = express.Router()
const longestPreviewMediaUrl = require('../models/longestPreviewMediaUrl')

router.get('/term/:tid/longest-preview-media-url', (req, res) => {
  longestPreviewMediaUrl(req.params.tid, (errStatus, data) => {
    if (errStatus) {res.sendStatus(errStatus);return;}
    res.json(data);
  });
})

module.exports = router
