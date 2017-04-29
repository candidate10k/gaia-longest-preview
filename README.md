### Description
A single endpoint that returns some JSON for the media it finds with the longest preview length.
Returns no data if no titles (or titles with previews) are found for the respective start tid.

### Assumptions
I tend to overthink things, especially something like this. So I put a time limit on this and assumed ~2 hours would be
what was expected. I hit about that for the core and then I spent a little more time on this readme and some cleanup.
No testing was mentioned, so I used that as an excuse to not add any. If I was more confident in my unit testing I would have added some.
Normally I would have a config file for dev/prod and there would be a lot more to app.js, but for this exercise I went with simpler and what I hope is easier for you to read.

### Issues
The url http://d6api.gaia.com/videos/term appears to return paginated results. The totalCount is 624 (and the currentPage is 0) but the titles result set is only 100. I tried /page/2 /pg/2 ?page=2 and a few other common page params, but without knowing that, I can't get the actual longest preview.
