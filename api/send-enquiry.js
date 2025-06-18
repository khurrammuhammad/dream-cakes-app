// --- ENQUIRY (Updated Version) ---
async function sendEnquiry() {
    if (document.querySelectorAll('.generated-image-option').length > 0 && selected_generated_image_index === null) {
        alert("Please select your favorite preview image before sending the enquiry.");
        return;
    }

    const enquiryButton = document.getElementById('send-enquiry-button');
    enquiryButton.disabled = true;
    enquiryButton.innerHTML = 'Compressing & Sending...';

    if (selected_generated_image_index !== null) {
        const selectedImgElement = document.getElementById('generated-image-grid').children[selected_generated_image_index];
        const compressedData = await compressImage(selectedImgElement.src);
        orderDetails.selected_ai_preview_data = compressedData;
    }
    
    enquiryButton.innerHTML = 'Sending Enquiry...';
    
    // ⬇️ THIS IS THE IMPORTANT CHANGE ⬇️
    // We now send the data to our own secure API endpoint.
    const secureApiEndpoint = '/api/send-enquiry'; 

    const totalPrice = document.getElementById('total-price').innerText;
    // We no longer need the inspiration_image_url field, only the compressed data
    const { inspiration_image_url, ...dataToSend } = { ...orderDetails, estimatedPrice: totalPrice };


    try {
        const response = await fetch(secureApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            document.getElementById('enquiry-section').style.display = 'none';
            document.getElementById('enquiry-confirmation').innerHTML = `<p class="font-semibold">Thank You!</p><p>Your enquiry has been sent successfully. We will be in touch shortly!</p>`;
            document.getElementById('enquiry-confirmation').style.display = 'block';
        } else {
            throw new Error('Failed to send enquiry.');
        }

    } catch (error) {
        alert('Sorry, there was a problem sending your enquiry. Please try again or contact us directly.');
        enquiryButton.disabled = false;
        enquiryButton.innerHTML = '📧 Send Enquiry';
    }
}
