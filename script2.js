function load_email_template() {
    document.querySelector(".selection-box").innerHTML=
    `<div class="row">
    <div class="label">
        <label for ="to">To: </label>
    </div>
    <div class="to_address_input">
        <input type="email" id="to" class="user-input" placeholder="">
    </div>
</div>

<div class="row">
    <div class="label">
        <label for ="from">From: </label>
    </div>
    <div class="from_address_input">
        <input type="email" id="from" class="user-input" placeholder="">
    </div>
</div>

<div class="row">
    <div class="label">
        <label for ="subject">Subject: </label>
    </div>
    <div class="subject_title_input">
        <input type="text" id="subject" class="user-input" placeholder="">
    </div>
</div>

<div class="row">
    <div class="label">
        <label for="body-content">Body: </label>
    </div>
    <div class="email_body_input">
        <textarea id="body-content" class="body-input" placeholder="" rows="10" cols="50"></textarea>
    </div>
</div>

<br>
<div class="row">
    <button class="index-buttons sender" onclick="send_message()">Send</button>
</div>`;
}





function composeEmail(){
    let to_address = document.querySelector("#to").value;
    let from_address = document.querySelector("#from").value;
    let subject = document.querySelector("#subject").value;
    let body_content = document.querySelector("#body-content").value

    let message = `From: ${from_address}\r\n`+
                   `To: ${to_address}\r\n`+
                   `Subject: ${subject}\r\n\r\n`+
                   `${body_content}`
    return message
}