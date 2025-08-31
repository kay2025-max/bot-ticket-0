import discord
from discord.ext import commands
import os

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Cấu hình
CHANNEL_ID = 1411219981173129216  # Kênh để react icon
QR_LINK = "https://media.discordapp.net/attachments/1407171235078602855/1411582406606979142/IMG_20250816_235413.jpg"
EMOJI_1 = "<a:2pinkChuyp:1411578843340345435>"
EMOJI_2 = "<a:hlg_yeye:1411579466290823188>"

# =========================
# Event on_message duy nhất
# =========================
@bot.event
async def on_message(message: discord.Message):
    if message.author.bot:
        return

    # Nếu +1 legit thì react icon
    if message.channel.id == CHANNEL_ID and "+1 legit" in message.content.lower():
        try:
            await message.add_reaction(EMOJI_1)
            await message.add_reaction(EMOJI_2)
        except Exception as e:
            print(f"❌ Không thể react: {e}")

    # Nếu có chữ bill thì gửi QR code
    if "bill" in message.content.lower():
        embed = discord.Embed(
            title="💳 Thông Tin Thanh Toán",
            description="Chỉ cần gửi bill, không cần ghi nội dung!",
            color=discord.Color.red()
        )
        embed.add_field(name="🏦 Ngân hàng", value="MB Bank", inline=True)
        embed.add_field(name="🔢 Số tài khoản", value="7718052009", inline=True)
        embed.add_field(name="👤 Chủ TK", value="Nguyễn Trung Kiên", inline=True)
        embed.set_image(url=QR_LINK)
        await message.channel.send(embed=embed)

    await bot.process_commands(message)

# =========================
# View class cho menu Store
# =========================
class StoreMenu(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

        self.add_item(
            discord.ui.Select(
                placeholder="🛒 Chọn sản phẩm premium → Xem giá ngay!",
                options=[
                    discord.SelectOption(label="Discord Nitro", value="nitro", description="Boost server & nhiều tính năng VIP", emoji="💎"),
                    discord.SelectOption(label="Boost Server", value="boost", description="Nâng cấp server Discord của bạn", emoji="🚀"),
                    discord.SelectOption(label="Spotify Premium", value="spotify", description="Nghe nhạc không quảng cáo", emoji="🎵"),
                    discord.SelectOption(label="YouTube Premium", value="youtube", description="Xem video không ads", emoji="▶️"),
                    discord.SelectOption(label="Netflix", value="netflix", description="Xem phim chất lượng cao", emoji="🎬"),
                ]
            )
        )

    @discord.ui.select(placeholder="🛒 Chọn sản phẩm premium → Xem giá ngay!")
    async def menu_callback(self, select: discord.ui.Select, interaction: discord.Interaction):
        choice = select.values[0]

        if choice == "nitro":
            e = discord.Embed(title="💎 DISCORD NITRO", description="1 tháng: 90k\n1 năm: 850k", color=0x5865F2)
        elif choice == "boost":
            e = discord.Embed(title="🚀 SERVER BOOST", description="1 Boost: 90k\n6 tháng: 500k", color=0xFF73FA)
        elif choice == "spotify":
            e = discord.Embed(title="🎵 SPOTIFY PREMIUM", description="1 tháng: 20k\n1 năm: 200k", color=0x1DB954)
        elif choice == "youtube":
            e = discord.Embed(title="▶️ YOUTUBE PREMIUM", description="1 tháng: 35k\n1 năm: 350k", color=0xFF0000)
        elif choice == "netflix":
            e = discord.Embed(title="🎬 NETFLIX PREMIUM", description="1 tháng: 60k\n1 năm: 600k", color=0xE50914)

        await interaction.response.send_message(embed=e, ephemeral=True)

# =========================
# Command Store
# =========================
@bot.command(name="store")
async def store(ctx):
    embed = discord.Embed(
        title="🌟 AN BÙI PREMIUM STORE 🌟",
        description="🎯 Chọn sản phẩm bên dưới để xem giá chi tiết",
        color=0x00d4ff
    )
    await ctx.send(embed=embed, view=StoreMenu())

# =========================
# Bot online
# =========================
@bot.event
async def on_ready():
    print(f"✅ Bot đã đăng nhập: {bot.user}")

bot.run(os.getenv("DISCORD_TOKEN"))
