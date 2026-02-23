import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"
import P from "pino"

async function startBot() {
  console.log("🚀 تشغيل البوت...")

  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "22.04"]
  })

  // حفظ الجلسة
  sock.ev.on("creds.update", saveCreds)

  // عند الاتصال
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    // طلب pairing code
    if (connection === "connecting") {
      if (!sock.authState.creds.registered) {
        const number = "212691362069" // 🔴 ضع رقمك هنا
        const code = await sock.requestPairingCode(number)
        console.log("🔑 Pairing Code:", code)
      }
    }

    // إعادة التشغيل عند الانقطاع
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log("🔌 انقطع:", reason)

      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      }
    }

    if (connection === "open") {
      console.log("✅ البوت متصل")
    }
  })

  // الرد على الرسائل
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const jid = msg.key.remoteJid

    await sock.sendMessage(jid, { text: "تم" })
  })
}

startBot()