'use strict'

const Promise = require("bluebird")
const request = require("request")

const requestOptions = {
  json:true //Sets headers to Accept:application/json
}


const getLongestPreviewMediaUrl = (tid, callback) => {
  getFirstTermId({tid})
  .then(getVideos)
  .then(getLongestPreview)
  .then(getMediaUrlbyNid)
  .then(prepareData)
  .then((data) => {
    callback(null, data)
  })
  .catch((err)=>{
    const statusCode = typeof err === 'number' ? err : 500;
    console.log(err);
    callback(statusCode);
  })
}

module.exports = getLongestPreviewMediaUrl

const getFirstTermId = ({tid}) => {
  if (!tid) {reject(400);return;}

  const firstUrl = 'http://d6api.gaia.com/vocabulary/1';
  const url = `${firstUrl}/${tid}`;
  const options = Object.assign({url}, requestOptions)
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {reject(response.statusCode);return;}
      if (!body.terms || !body.terms.length) {reject(200);return;}
      const firstTermId = body.terms[0].id;
      resolve({firstTermId});
    });
  })
}

const getVideos = ({firstTermId}) => {
  const videosUrl = 'http://d6api.gaia.com/videos/term';
  const url = `${videosUrl}/${firstTermId}`;
  const options = Object.assign({url}, requestOptions);

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {reject(response.statusCode);return;}
      if (!body.titles || !body.titles.length) {reject(200);return;}
      const videos = body.titles;
      resolve({videos});
    });
  })
}

const getLongestPreview = ({videos}) => {
  const sorted = sortByPreviewDuration(videos);
  const longestPreview = sorted[0];
  if (!longestPreview.preview) return Promise.reject(200);//As some do not have previews, I would expect this to happen for some tid's

  return ({longestPreview});
}

const getMediaUrlbyNid = ({longestPreview}) => {
  const nid = longestPreview.preview.nid;
  const videosUrl = 'http://d6api.gaia.com/media/';
  const url = `${videosUrl}/${nid}`;
  const options = Object.assign({url}, requestOptions);

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {reject(response.statusCode);return;}
      const bcHLS = body.mediaUrls ? body.mediaUrls.bcHLS : null;
      resolve({longestPreview, bcHLS});
    });

  })
}

/*
  Prepare the expected response. I would assume that some last minute checking would go here (or before here), depending on
  any other potential data issues for different results returned from other tid's
*/

const prepareData = ({longestPreview, bcHLS}) => {
  const previewDuration = parseInt(longestPreview.preview.duration);
  return {
    bcHLS : bcHLS,
    titleNid : longestPreview.nid,
    previewNid : longestPreview.preview.nid,
    previewDuration
  }
}

const sortByPreviewDuration = (videos) => {
  return videos.sort((a, b) => {
    //Handle no preview
    let durationA = a.preview ? parseInt(a.preview.duration) : -1;
    let durationB = b.preview ? parseInt(b.preview.duration) : -1;
    //Handle potential bad duration
    durationA = !isNaN(durationA) ? durationA : -1;
    durationB = !isNaN(durationB) ? durationB : -1;

    if (durationA > durationB) {
      return -1;
    }
    if (durationA < durationB) {
      return 1;
    }

    return 0;
  })
}
