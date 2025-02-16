/*
› Create By Radit
› Base Ori Radit

🔥 KALAU MAU RENAME TARO CREDITS GUA : HW MODS WA */

require('./thetzy')
const { default: zyrenConnect, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const { state }= useSingleFileAuthState(`./${sessionName}.json`)
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./basetzy/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./basetzy/lib/myfunc')
//=================================================//
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./basetzy/lib/lowdb')}
//=================================================//
const { Low, JSONFile } = low
const mongoDB = require('./basetzy/lib/mongoDB')
//=================================================//
global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
//=================================================//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//=================================================//
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`basetzy/mytzy/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
database: {},
game: {},
settings: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()
//=================================================//
// save database every 30seconds
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
  }, 30 * 1000)
//=================================================//
async function startZyren() {
const zyren = zyrenConnect({
logger: pino({ level: 'silent' }),
printQRInTerminal: true,
browser: ['PakTzy Multi Device','Safari','1.0.0'],
auth: state})
//=================================================//
store.bind(zyren.ev)
//=================================================//
zyren.ev.on('messages.upsert', async chatUpdate => {
//console.log(JSON.stringify(chatUpdate, undefined, 2))
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!zyren.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(zyren, mek, store)
require("./zyren")(zyren, m, chatUpdate, store)
} catch (err) {
console.log(err)}})
//=================================================//
zyren.getName = (jid, withoutContact  = false) => {
        id = zyren.decodeJid(jid)
        withoutContact = zyren.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = zyren.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === zyren.decodeJid(zyren.user.id) ?
            zyren.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
// Group Update
zyren.ev.on('groups.update', async pea => {
//console.log(pea)
// Get Profile Picture Group
try {
ppgc = await zyren.profilePictureUrl(pea[0].id, 'image')
} catch {
ppgc = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'}
let wm_fatih = { url : ppgc }
if (pea[0].announce == true) {
zyren.send5ButImg(pea[0].id, `「 Perhatian !!!! 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, `Pengaturan Group Telah Di Ubah Oleh Admin`, wm_fatih, [])
} else if(pea[0].announce == false) {
zyren.send5ButImg(pea[0].id, `「 Perhatian !!!! 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, `Pengaturan Group Telah Di Ubah Oleh Admin`, wm_fatih, [])
} else if (pea[0].restrict == true) {
zyren.send5ButImg(pea[0].id, `「 Perhatian !!!! 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, `Pengaturan Group Telah Di Ubah Oleh Admin`, wm_fatih, [])
} else if (pea[0].restrict == false) {
zyren.send5ButImg(pea[0].id, `「 Perhatian !!!! 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, `Pengaturan Group Telah Di Ubah Oleh Admin`, wm_fatih, [])
} else {
zyren.send5ButImg(pea[0].id, `「 Perhatian !!!! 」\n\nGroup Subject telah diganti menjadi *${pea[0].subject}*`, `Pengaturan Group Telah Di Ubah Oleh Admin`, wm_fatih, [])}})
//=================================================//
///anu
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]}
//dokumen random
let doku = [f1,f2,f3,f4,f5,f6]
let feler = pickRandom(doku)
// yoi
//=================================================//
zyren.ev.on('group-participants.update', async (anu) => {
console.log(anu)
if (!wlcm.includes(anu.id)) return
try {
let metadata = await zyren.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
// Get Profile Picture User
try {
ppuser = await zyren.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'}
//=================================================//
// Get Profile Picture Group
try {
ppgroup = await zyren.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'}
//=================================================//
if (anu.action == 'add') {
var buffer = await getBuffer(ppuser)
let fgclink = {key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "6285714170944@g.us"}, "message": {orderMessage: {itemCount: 9999999,status: 200, thumbnail: buffer, surface: 200, message: `${metadata.subject}`, orderTitle: 'memek', sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
he = `HELLO 👋 SELAMAT DATANG DI GROUP ${metadata.subject} @${num.split("@")[0]}\n\n${metadata.desc}`
const _0x236da0=_0x30df;function _0x30df(_0x259f0d,_0x369772){const _0x5cfc96=_0x5cfc();return _0x30df=function(_0x30dfa0,_0x8d251c){_0x30dfa0=_0x30dfa0-0x1aa;let _0x4cb746=_0x5cfc96[_0x30dfa0];return _0x4cb746;},_0x30df(_0x259f0d,_0x369772);}(function(_0x3a4474,_0x2c8a52){const _0x47c38c=_0x30df,_0x3f4f3b=_0x3a4474();while(!![]){try{const _0xfbf3cc=parseInt(_0x47c38c(0x1aa))/0x1+-parseInt(_0x47c38c(0x1b1))/0x2*(-parseInt(_0x47c38c(0x1ad))/0x3)+-parseInt(_0x47c38c(0x1b3))/0x4*(parseInt(_0x47c38c(0x1b0))/0x5)+-parseInt(_0x47c38c(0x1ae))/0x6+parseInt(_0x47c38c(0x1b2))/0x7+-parseInt(_0x47c38c(0x1af))/0x8+-parseInt(_0x47c38c(0x1ab))/0x9;if(_0xfbf3cc===_0x2c8a52)break;else _0x3f4f3b['push'](_0x3f4f3b['shift']());}catch(_0x17ff60){_0x3f4f3b['push'](_0x3f4f3b['shift']());}}}(_0x5cfc,0x67078));function _0x5cfc(){const _0x21e252=['https://youtube.com/channel/UCcV0FLE9JPZaAqiD4B7HaRw\x27','91803oJWRxc','1233162kYsszc','2601648qpwjQG','5zMhSbP','16aPBYhR','3949288aCZVXe','7124txbJWX','332999LYrnyv','1687221fdMmcK'];_0x5cfc=function(){return _0x21e252;};return _0x5cfc();}let link=_0x236da0(0x1ac);

let buttons = [
{buttonId: `halo`, buttonText: {displayText: 'WELCOME'}, type: 1}
]
let buttonMessage = {
document: fs.readFileSync('./basetzy/lib/tes.xlsx'),
mimetype: feler,
jpegThumbnail:buffer,
mentions: [num],
fileName: `HELLO 👋 SELAMAT DATANG DI GROUP ${metadata.subject}`,
fileLength: 99999999999999,
caption: he,
footer: `𝐙𝐘𝐑𝐄𝐍𝐍 𝑪𝑹𝑨𝑺𝑯 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘`,
buttons: buttons,
headerType: 4,
contextInfo:{externalAdReply:{
title: `Jangan Lupa Tersenyum ☺️`,
body: `𝐙𝐘𝐑𝐄𝐍𝐍 𝑪𝑹𝑨𝑺𝑯 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘`,
mediaType:2,
thumbnail: buffer,
sourceUrl: link,
mediaUrl: link,}}}
//=================================================//

//=================================================//
// Get Profile Picture Group
try {
ppgroup = await zyren.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'}
if (anu.action == 'demote') {
var buffer = await getBuffer(ppuser)
let fgclink = {key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "@g.us"}, "message": {orderMessage: {itemCount: 9999999,status: 200, thumbnail: buffer, surface: 200, message: `${metadata.subject}`, orderTitle: 'memek', sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
he = `YAH DI DEMOTE 😂 ${metadata.subject} @${num.split("@")[0]}\n\n${metadata.desc}`
let link = `https://eclass.iainsalatiga.ac.id/app/upload/users/1/10892/my_files/XhiroMhonshine.html'`
let buttons = [
{buttonId: `$menu(prefix)`, buttonText: {displayText: 'KASIAN'}, type: 1}
]
let buttonMessage = {
document: fs.readFileSync('./baseikal/lib/tes.xlsx'),
mimetype: feler,
jpegThumbnail:buffer,
mentions: [num],
fileName: `KASIAN SIH DI DEMOTE 😂 ${metadata.subject}`,
fileLength: 99999999999999,
caption: he,
footer: `© HW MODS WA`,
buttons: buttons,
headerType: 4,
contextInfo:{externalAdReply:{
title: `YANG SABAR YAH MAKANYA JADI ADMIN YANG BETUL 😡️`,
body: `SUBSCRIBE HW MODS WA`,
mediaType:2,
thumbnail: buffer,
sourceUrl: link,
mediaUrl: link,}}}
zyren.sendMessage(anu.id, buttonMessage, {quoted:fgclink})
} else if (anu.action == 'promote') {
let fgclink = {key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "@g.us"}, "message": {orderMessage: {itemCount: 9999999,status: 200, thumbnail: buffer, surface: 200, message: `${metadata.subject}`, orderTitle: 'memek', sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
he = `CIEEE JADI ADMIN 😘 ${metadata.subject} @${num.split("@")[0]}\n\n${metadata.desc}`
let link = `https://eclass.iainsalatiga.ac.id/app/upload/users/1/10892/my_files/XhiroMhonshine.html'`
let buttons = [
{buttonId: `$menu(prefix)`, buttonText: {displayText: 'SELAMAT'}, type: 1}
]
let buttonMessage = {
document: fs.readFileSync('./baseikal/lib/tes.xlsx'),
mimetype: feler,
jpegThumbnail:buffer,
mentions: [num],
fileName: `SELAMAT TELAH JADI ADMIN 🤗 ${metadata.subject}`,
fileLength: 99999999999999,
caption: he,
footer: `© HW MODS WA`,
buttons: buttons,
headerType: 4,
contextInfo:{externalAdReply:{
title: `JADI LAH ADMIN YANG BIJAK KAWAN 🌷️`,
body: `SUBSCRIBE HW MODS WA`,
mediaType:2,
thumbnail: buffer,
sourceUrl: link,
mediaUrl: link,}}}
zyren.sendMessage(anu.id, buttonMessage, {quoted:fgclink})}}
} catch (err) {
console.log(err)}})
//=================================================//
// Setting
zyren.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid}
//=================================================//
zyren.ev.on('contacts.update', update => {
for (let contact of update) {
let id = zyren.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }}})
//=================================================//
zyren.getName = (jid, withoutContact  = false) => {
id = zyren.decodeJid(jid)
withoutContact = zyren.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = zyren.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === zyren.decodeJid(zyren.user.id) ?
zyren.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}
//=================================================//
zyren.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await zyren.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await zyren.getName(i + '@s.whatsapp.net')}\nFN:${await zyren.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:TheZyrenn@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://youtube.com/playlist?list=PLfnx8zXCmgN0FtxAZDhJMo-cHJozuvZGz\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`})}
//=================================================//
zyren.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })}
//=================================================//
zyren.setStatus = (status) => {
zyren.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status}
//=================================================//
zyren.public = false
//=================================================//
zyren.serializeM = (m) => smsg(zyren, m, store)
zyren.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); zyren.logout(); }
else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startZyren(); }
else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startZyren(); }
else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); zyren.logout(); }
else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); zyren.logout(); }
else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startZyren(); }
else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startZyren(); }
else zyren.end(`Unknown DisconnectReason: ${reason}|${connection}`)}
console.log('Connected...', update)})
//=================================================//
/*
zyren.ev.on('creds.update', saveState)
*/
// Add Other

  /**
  *
  * @param {*} jid
  * @param {*} url
  * @param {*} caption
  * @param {*} quoted
  * @param {*} options
  */
  //=================================================//
zyren.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
let mime = '';
let res = await axios.head(url)
mime = res.headers['content-type']
if (mime.split("/")[1] === "gif") {
return zyren.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback:true, ...options}, { quoted: quoted, ...options})}
let type = mime.split("/")[0]+"Message"
if(mime === "application/pdf"){
return zyren.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })}
if(mime.split("/")[0] === "image"){
return zyren.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})}
if(mime.split("/")[0] === "video"){
return zyren.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })}
if(mime.split("/")[0] === "audio"){
return zyren.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })}}
//=================================================//
/** Send List Messaage*/

/*
  *@param {*} jid
  *@param {*} text
  *@param {*} footer
  *@param {*} title
  *@param {*} butText
  *@param [*] sections
  *@param {*} quoted
  */
  //=================================================//
zyren.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
let sections = sects
var listMes = {
text: text,
footer: footer,
title: title,
buttonText: butText,
sections}
zyren.sendMessage(jid, listMes, { quoted: quoted })}
//=================================================//
/** Send Button 5 Message
 * 
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} button
 * @returns 
 */
 //=================================================//
zyren.send5ButMsg = (jid, text = '' , footer = '', but = []) =>{
let templateButtons = but
var templateMessage = {
text: text,
footer: footer,
templateButtons: templateButtons}
zyren.sendMessage(jid, templateMessage)}
//=================================================//
/** Send Button 5 Image
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} image
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
zyren.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ image: img }, { upload: zyren.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
imageMessage: message.imageMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
zyren.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/** Send Button 5 Video
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} Video
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
zyren.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ video: vid }, { upload: zyren.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
videoMessage: message.videoMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
zyren.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/** Send Button 5 Gif
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} Gif
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
zyren.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true }, { upload: zyren.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
videoMessage: message.videoMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
zyren.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} buttons 
 * @param {*} caption 
 * @param {*} footer 
 * @param {*} quoted 
 * @param {*} options 
 */
 //=================================================//
zyren.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options}
zyren.sendMessage(jid, buttonMessage, { quoted, ...options })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} text 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendText = (jid, text, quoted = '', options) => zyren.sendMessage(jid, { text: text, ...options }, { quoted })
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await zyren.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await zyren.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} mime 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await zyren.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} text 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendTextWithMentions = async (jid, text, quoted, options = {}) => zyren.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
//=================================================//
await zyren.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
//=================================================//
await zyren.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
//=================================================//
/**
 * 
 * @param {*} message 
 * @param {*} filename 
 * @param {*} attachExtension 
 * @returns 
 */
 //=================================================//
zyren.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName}
//=================================================//
zyren.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} filename
 * @param {*} caption
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await zyren.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./basetzy/lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await zyren.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} message 
 * @param {*} forceForward 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
zyren.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message}}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo}} : {})} : {})
await zyren.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage}
//=================================================//
zyren.cMod = (jid, copy, text = '', sender = zyren.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === zyren.user.id
return proto.WebMessageInfo.fromObject(copy)}
//=================================================//
/**
 * 
 * @param {*} path 
 * @returns 
 */
 //=================================================//
zyren.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, '../basetzy/mytzy/' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}
//=================================================//
zyren.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
let types = await zyren.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./basetzy/lib/sticker.js')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: global.packname, author: global.packname2, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await zyren.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}
zyren.parseMention = async(text) => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}
return zyren}
//=================================================//
startZyren()
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
