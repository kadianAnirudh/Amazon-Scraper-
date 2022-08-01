

// Importing axios
const axios = require('axios');

require('dotenv').config()

const cheerio = require('cheerio');

const url = 'https://www.amazon.in/Redragon-KUMARA-Backlit-Mechanical-Keyboard/dp/B016MAK38U/ref=d_pd_sbs_sccl_2_5/258-8204660-8550835?pd_rd_w=CuTsy&content-id=amzn1.sym.2db7fcb9-4c68-4d7a-84ce-450f877f4572&pf_rd_p=2db7fcb9-4c68-4d7a-84ce-450f877f4572&pf_rd_r=DW2HYH8M6KRW1HY8JN8H&pd_rd_wg=RvGAo&pd_rd_r=652bb94f-8ccb-49cc-8a47-75dea0d9839c&pd_rd_i=B016MAK38U&psc=1';

const product = {name : '', price : '', link : ''}

const accountSID = process.env.SID
const accountAuth = process.env.AUTH
const accountPhone = process.env.PHONE

const client = require('twilio')(accountSID, accountAuth)

// runs the scrape function, which removes handle via clear interval, hence it runs only once. 
const handle = setInterval(scrape, 10000);


// async means that it woud run first and then the code would move forward
async function scrape(){
// Data fetch 

const { data } = await axios.get(url)

//load html data

const $ = cheerio.load(data);
const item = $('div #dp')
// data extraction.
// find the h1  span inside div called dp
product.name = $(item).find('h1 span#productTitle').text()
price = $(item).find('span .a-price-whole').first().text().replace(/[,.]/g, "")
product.link = url;
const productNum = parseInt(price)
product.price = productNum;
//sending SMS
if ( productNum < 2600 ){
client.messages.create({ 
    body : `The price of ${product.name} has gone below its previous price of ${product.price}. You can  purchase it at ${product.link}`,
    from : accountPhone,
    to : '+91 98213 31964'
}).then(message => {
    console.log(message);
})
clearInterval(handle);
}
}

scrape()