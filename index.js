let bouquet_code = document.getElementById("bouquet_code");
let vend_feedback = document.querySelector('.vend_feedback');


let cable_provider = document.getElementById("cable_provider").value;
document.getElementById("cable_provider").onchange = function (e) {
    cable_provider = this.value;
    retrieveBouquetCode(cable_provider);
}

// Alternate way to get select value
/*
  function myFunction() {
  var x = document.getElementById("mySelect").value;
  document.getElementById("demo").innerHTML = x;
}
*/

// Another way
/*
    var select = document.getElementById('language');
    var value = select.options[select.selectedIndex].value;
*/

// console.log(cable_provider)

// Retreive Providers Code 
function retrieveBouquetCode(cableProvider) {
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTY2ZTU2NzIyYWU2NTA2NGZiNGJlOCIsImlhdCI6MTYwNzEwNTk5OCwiZXhwIjozMTcxNTE1NDgzOTh9.-1ZVCt99jk6a4KTOch4dH3mZaIDSu79ojO0P6QPf_Go'
        }
    };

    fetch(`https://vas-vendors.myfela.ng/staging/cabletv/listBouquets/${cableProvider}`, options)
        .then(response => response.json())
        .then(response => {
            console.log(response.data);
            createBouquetOptions(response, bouquet_code, "option")
        })
        .catch(err => console.error(err));
}

// Create html element template for api responses
function createBouquetOptions(resp, htmlContainer, htmlElementToCreate) {
    htmlContainer.innerHTML = "";
    let resultProperties = [];

    for (key in resp.data) {
        let property = [];
        property.push(key);
        property.push(resp.data[key]);
        resultProperties.push(property);
    }
    console.log(resultProperties);

    resultProperties.forEach(item => {
        const element = document.createElement(htmlElementToCreate);
        element.setAttribute("value", `${item[1].code}`);
        element.innerText = `${item[1].title}`;

        htmlContainer.appendChild(element);
    })

}


// show a message with a type of the input
function showMessage(input, message, type) {
    // get the small element and set the message
    const msg = input.parentNode.querySelector("small");
    msg.innerText = message;
    // update the class for the input
    input.className = type ? "success" : "error";
    return type;
}

function showError(input, message) {
    return showMessage(input, message, false);
}

function showSuccess(input) {
    return showMessage(input, "", true);
}

function hasValue(input, message) {
    if (input.value.trim() === "") {
        return showError(input, message);
    }
    return showSuccess(input);
}


const form = document.querySelector("#form");

const IUC_REQUIRED = "Please enter smart Card Number";
const PROVIDER_REQUIRED = "Please choose provider";
const BOUQUET_REQUIRED = "Please choose bouquet";
const MERCHANT_ID = "Please enter merchant ID";
const TRANSACTION_REFERENCE = "Please enter transaction reference";

form.addEventListener("submit", function (event) {
    // stop form submission
    event.preventDefault();

    // validate the form
    let iucValid = hasValue(form.elements["card_number"], IUC_REQUIRED);
    let providerValid = hasValue(form.elements["cable_provider"], PROVIDER_REQUIRED);
    let bouquetValid = hasValue(form.elements["bouquet_code"], BOUQUET_REQUIRED);
    let merchantValid = hasValue(form.elements["merchant_id"], MERCHANT_ID);
    let trnsactionValid = hasValue(form.elements["transact_ref"], TRANSACTION_REFERENCE);

    const iuc_number = form.elements["card_number"].value;
    const provider = form.elements["cable_provider"].value;

    const bouquet = form.elements["bouquet_code"].value;
    const merchant = form.elements["merchant_id"].value;

    const trans_ref = form.elements["transact_ref"].value;

    // if valid, submit the form.
    if (iucValid && providerValid && bouquetValid && merchantValid && trnsactionValid) {
        // console.log(iuc_number, provider, bouquet, merchant, trans_ref)
        cableVend_request(iuc_number, provider, bouquet, merchant, trans_ref)
    }
});

function cableVend_request(iuc_number, provider, bouquet, merchant, trans_ref) {
    const loader = document.querySelector(".loader_container");
    loader.hidden = false;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTY2ZTU2NzIyYWU2NTA2NGZiNGJlOCIsImlhdCI6MTYwNzEwNTk5OCwiZXhwIjozMTcxNTE1NDgzOTh9.-1ZVCt99jk6a4KTOch4dH3mZaIDSu79ojO0P6QPf_Go'
        },
        body: `{
            "smartcard_no":"${iuc_number}",
            "provider_code":"${provider}",
            "bouquet_code":"${bouquet}",
            "merchant_id":"${merchant}",
            "transaction_reference":"${trans_ref}"
        }`
    };

    fetch('https://vas-vendors.myfela.ng/staging/cabletv/vendCabletv', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if (response.ok) {
                loader.hidden = true;
                vend_feedback.innerHTML = "Please check the parameters and try the reauest again"
                console.log("No result")
            } else {



                loader.hidden = true;
                function vendResultOutput() {

                    const element = `
                       <div>
                       <span>Status:<span>${response.status}!</span>
                       </div>
                       <div>
                       <span>Provider:<span>${response.data.provider}</span>
                       </div>
                       <div>
                       <span>Package Name:<span>${response.data.packageName}</span>
                       </div>
                       <div>
                       <span>Smart Card Number:<span>${response.data.smartCardNo}</span>
                       </div>
                       <div>
                       <span>Amount:<span>${response.data.amount} naira</span>
                       </div>
                       <div>
                       <span>Receipt ID:<span>${response.data.receiptId}</span>
                       </div>
                       <div>
                       <span>Date:<span>${response.data.date}</span>
                       </div>
                       <div>
                       <span>Merchant ID:<span>${response.data.commissionInfo.merchant_id}</span>
                       </div>
                       <div>
                       <span>Vend Amount:<span>${response.data.commissionInfo.vendAmount}</span>
                       </div>
                       <div>
                       <span>Service:<span>${response.data.commissionInfo.service}</span>
                       </div>
                       <div>
                       <span>Service Provider:<span>${response.data.commissionInfo.service_provider}</span>
                       </div>
                       <div>
                       <span>Commission Rate:<span>${response.data.commissionInfo.commissionRate}</span>
                       </div>
                       <div>
                       <span>Commission Gained:<span>${response.data.commissionInfo.commissionGained}</span>
                       </div>
                       <div>
                       <span>Discounted Amount:<span>${response.data.commissionInfo.discountedAmount}</span>
                       </div>

                   `;
                    vend_feedback.innerHTML = element
                }
                vendResultOutput();
            }

        })
        .catch(err => console.error(err));
};





