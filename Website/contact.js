document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  
  // Check if form exists
  if (!form) {
    console.error("Form with id 'contactForm' not found");
    return;
  }
  
  const submitBtn = form.querySelector("button");
  
  // Check if button exists
  if (!submitBtn) {
    console.error("Submit button not found in form");
    return;
  }

  const N8N_WEBHOOK_URL = "https://primary-production-ddbcd.up.railway.app/webhook/a0fa62c2-f3d8-416a-b753-b0b3a9589bab";

  function showNotification(message, isError = false) {
    // You can replace this with a nicer notification system
    if (isError) {
      console.error(message);
      alert("❌ " + message);
    } else {
      alert("✅ " + message);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const data = {
      org_name: form.org_name?.value?.trim() || "",
      email: form.email?.value?.trim() || "",
      phone: form.phone?.value?.trim() || "",
      event_date: form.event_date?.value || "",
      budget: form.budget?.value || "",
      message: form.message?.value?.trim() || ""
    };

    // Validate required fields
    if (!data.org_name || !data.email) {
      showNotification("Please fill all required fields (Organization Name and Email)", true);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address", true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    try {
      // Save to Supabase if available
      if (window.supabaseClient) {
        try {
          const { error } = await window.supabaseClient
            .from("contact_messages")
            .insert({
              ...data,
              status: "unread",
              created_at: new Date().toISOString()
            });

          if (error) throw error;
          console.log("Data saved to Supabase");
        } catch (supabaseError) {
          console.warn("Supabase save failed:", supabaseError);
          // Continue anyway - don't block the user
        }
      } else {
        console.log("Supabase client not available, skipping database save");
      }

      // Send to n8n webhook (removed no-cors mode to see actual error)
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn("Webhook responded with error:", response.status, errorText);
          // Don't throw - just warn since this is for notifications
        } else {
          console.log("Webhook notification sent successfully");
        }
      } catch (webhookError) {
        console.warn("Webhook notification failed:", webhookError);
        // Continue anyway - form submission is still successful
      }

      showNotification("Message sent successfully! We'll get back to you soon.");
      form.reset();

    } catch (error) {
      console.error("Form submission failed:", error);
      showNotification("Something went wrong. Please try again or contact us directly.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
    }
  });
});
