form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData(form);

        const data = {
            org_name: formData.get("org_name")?.trim(),
            email: formData.get("email")?.trim(),
            phone: formData.get("phone")?.trim(),
            event_date: formData.get("event_date"),
            budget: formData.get("budget"),
            message: formData.get("message")?.trim()
        };

        // validation
        if (!data.org_name || !data.email) {
            if (typeof showNotification === "function") {
                showNotification("Please fill required fields", "error");
            }
            return;
        }

        const submitBtn = form.querySelector("button[type='submit']");

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
        }

        // Supabase (safe)
        if (window.supabaseClient) {
            await supabaseClient.from("contact_messages").insert({
                ...data,
                status: "unread"
            });
        }

        // PHP request
        const res = await fetch("mailman/send.php", {
            method: "POST",
            body: new URLSearchParams(data)
        });

        const result = await res.text();

        if (result !== "OK") {
            throw new Error(result);
        }

        // SUCCESS
        if (typeof showNotification === "function") {
            showNotification("Message sent successfully!", "success");
        }

        form.reset();

    } catch (err) {
        console.error(err);

        if (typeof showNotification === "function") {
            showNotification("Failed to send message", "error");
        }

    } finally {
        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
        }
    }
});
