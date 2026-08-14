fetch('https://api.nodemailer.com/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    requestor: 'spatify',
    version: '1.0'
  })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data)))
.catch(console.error);
