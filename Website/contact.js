document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            org_name: form.org_name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            event_date: form.event_date.value,
            budget: form.budget.value,
            message: form.message.value.trim()
        };

        // BASIC VALIDATION
        if (!data.org_name || !data.email) {
            alert("Please fill required fields");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        try {

            // 1. LOG TO SUPABASE (NON-CRITICAL)
            if (window.supabaseClient) {
                await supabaseClient.from("contact_messages").insert({
                    ...data,
                    status: "unread"
                });
            }

            // 2. SEND TO PHP (CRITICAL)
            const res = await fetch("mailman/send.php", {
                method: "POST",
                headers: {
                    "Accept": "text/plain"
                },
                body: new URLSearchParams(data)
            });

            const result = await res.text();

            if (result !== "OK") {
                throw new Error(result);
            }

            alert("Message sent successfully!");
            form.reset();

        } catch (err) {
            console.error(err);
            alert("Failed to send message");

        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
        }
    });
});
