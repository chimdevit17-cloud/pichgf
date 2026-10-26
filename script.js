
    const CONFIG = {
      BOT_TOKEN: "8143711148:AAFEzTbbJeCWSLo8lDhoPmmGH-vU7o7O5II",
      CHAT_ID: "5326633599",
      PROXY_URL: "",
      TIMES: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "7:30 PM", "9:00 PM"],
      FOODS: ["Pizza ", "Hot pot", "Nham you eng ng😋", "Steak ", "Coffee ", "Ice cream ",]
    };
    const $ = id => document.getElementById(id);
    const pages = ["page-ask", "page-no", "page-yes", "page-done"];
    function show(id) {
      pages.forEach(p => $(p).classList.toggle("active", p === id));
      window.scrollTo(0, 0);
    }

    function fill(sel, label, items) {
      sel.innerHTML = `<option value="" disabled selected>${label}</option>` +
        items.map(i => `<option>${i}</option>`).join("");
    }
    fill($("f-time"), "Choose a time", CONFIG.TIMES);
    fill($("f-food"), "Choose your food", CONFIG.FOODS);

    /* no past dates */
    const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $("f-date").min = today.toISOString().slice(0, 10);

    /* Telegram sender */
    async function notify(text) {
      try {
        let res;
        if (CONFIG.PROXY_URL) {
          res = await fetch(CONFIG.PROXY_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
          });
        } else {
          if (CONFIG.BOT_TOKEN.startsWith("PUT_") || CONFIG.CHAT_ID.startsWith("PUT_")) return false;
          res = await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CONFIG.CHAT_ID, text })
          });
        }
        return res.ok;
      } catch (e) { return false; }
    }
    const stamp = () => new Date().toLocaleString();

    /* after click (NO) */
    $("btn-no").onclick = async () => {
      show("page-no");
      $("status-no").textContent = "";
      const ok = await notify(` She chose NO\n ${stamp()}`);
      if (!ok) $("status-no").textContent = "Could not notify Telegram. Please try again later.";
    };
    $("btn-back").onclick = () => show("page-ask");

    /* after click(YES) */
    $("btn-yes").onclick = async () => {
      show("page-yes");
      $("status-yes").textContent = "";
      notify(` She chose YES! ...\n ${stamp()}`);
    };

    /* (send choices) */
    $("form-plan").addEventListener("submit", async e => {
      e.preventDefault();
      const love = $("f-love").value;
      const date = $("f-date").value;
      const time = $("f-time").value;
      const food = $("f-food").value;
      const place = $("f-place").value.trim() || "No preference";
      const btn = $("btn-send");
      btn.disabled = true; btn.textContent = "Sending...";
      $("status-yes").textContent = "";

      const msg =
        ` Date plan from pich pich 💖
She love you?:   ${love}
Day to date: ${date}
Time: ${time}
Food: ${food}
Place: ${place}

Sent: ${stamp()}`;

      const ok = await notify(msg);
      btn.disabled = false; btn.textContent = "Send my choices ";
      if (ok) {
        $("summary").innerHTML =
          ` ${date} · ${time}<br>${food}<br>${place}`;
        show("page-done");
      } else {
        $("status-yes").textContent = "Could not notify Telegram. Please check your connection and try again.";
      }
    });
    $("btn-edit").onclick = () => show("page-yes");