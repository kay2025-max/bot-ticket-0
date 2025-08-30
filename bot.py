import discord
from discord.ext import commands

GUILD_ID = 1409783871947407482 # ID server của bạn

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# Lệnh gửi bảng giá
@bot.command(name="store")
async def store(ctx):
    embed = discord.Embed(
        title="🌟 **AN BÙI PREMIUM STORE** 🌟",
        description=(
            "┌─────────────────────────────────┐\n"
            "│  🎯 **Chọn sản phẩm bên dưới**  │\n"
            "└─────────────────────────────────┘\n\n"
            "💎 **Cam kết:**\n"
            "• ✅ Hàng chính hãng 100%\n"
            "• 🚀 Giao hàng tức thì\n"
            "• 🛡️ Bảo hành trọn đời\n\n"
            "💰 **Thanh toán:** Bank • Momo • Card • LTC\n"
            "⚡ **Hỗ trợ:** 24/7 online"
        ),
        color=0x00d4ff
    )
    embed.set_footer(text="⚠️ Giá có thể thay đổi • Cập nhật realtime", icon_url="https://cdn.discordapp.com/emojis/1303541197167657030.png")
    embed.set_author(name="Premium Digital Store", icon_url="https://cdn.discordapp.com/emojis/1411236082279780455.png")

    menu = discord.ui.Select(
        placeholder="🛒 Chọn sản phẩm premium → Xem giá ngay!",
        options=[
            discord.SelectOption(label="Discord Nitro", value="nitro", description="Boost server & nhiều tính năng VIP", emoji="<:OIP:1303541197167657030>"),
            discord.SelectOption(label="Boost Server", value="boost", description="Nâng cấp server Discord của bạn", emoji="<:12141booster:1411236082279780455>"),
            discord.SelectOption(label="Spotify Premium", value="spotify", description="Nghe nhạc không quảng cáo", emoji="<:2320spotify:1411235579063959653>"),
            discord.SelectOption(label="YouTube Premium", value="youtube", description="Xem video không ads", emoji="<:Youtube:1411233236243320862>"),
            discord.SelectOption(label="Netflix", value="netflix", description="Xem phim chất lượng cao", emoji="<:netflix:1411235722660155412>"),
        ]
    )

    async def menu_callback(interaction: discord.Interaction):
        choice = menu.values[0]
        if choice == "nitro":
            e = discord.Embed(
                title="💎 **DISCORD NITRO PREMIUM**",
                description=(
                    "```yaml\n"
                    "🔥 NITRO BOOST - Server Level Up\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 tháng    │     90,000đ    │\n"
                    "│ 2 tháng    │    150,000đ    │\n"
                    "│ 4 tháng    │    120,000đ    │\n"
                    "│ 1 năm      │    850,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "🎁 Tặng kèm: Decor Profile 66k\n\n"
                    "⭐ NITRO BASIC - Essential\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 tháng    │     45,000đ    │\n"
                    "│ 1 năm      │    430,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "```"
                ),
                color=0x5865F2
            )
            e.set_footer(text="🎯 Best seller • Boost ngay server của bạn!")
        elif choice == "boost":
            e = discord.Embed(
                title="🚀 **SERVER BOOST PACKAGE**",
                description=(
                    "```yaml\n"
                    "💫 Nâng cấp server Discord\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 Boost    │     90,000đ    │\n"
                    "│ 2 Boost    │    170,000đ    │\n"
                    "│ 6 tháng    │    500,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "```\n"
                    "🌟 **Lợi ích:**\n"
                    "• 📁 Upload file lớn hơn\n"
                    "• 🎨 Custom emoji & sticker\n"
                    "• 🔊 Chất lượng voice tốt hơn"
                ),
                color=0xFF73FA
            )
            e.set_footer(text="⚡ Boost server = Trải nghiệm VIP!")
        elif choice == "spotify":
            e = discord.Embed(
                title="🎵 **SPOTIFY PREMIUM**",
                description=(
                    "```yaml\n"
                    "🎶 Âm nhạc không giới hạn\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 tháng    │     20,000đ    │\n"
                    "│ 3 tháng    │     55,000đ    │\n"
                    "│ 1 năm      │    200,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "```\n"
                    "🎤 **Tính năng:**\n"
                    "• 🚫 Không quảng cáo\n"
                    "• ⬇️ Tải nhạc offline\n"
                    "• 🔀 Skip không giới hạn\n"
                    "• 🎧 Chất lượng âm thanh cao"
                ),
                color=0x1DB954
            )
            e.set_footer(text="🎵 Enjoy music like never before!")
        elif choice == "youtube":
            e = discord.Embed(
                title="▶️ **YOUTUBE PREMIUM**",
                description=(
                    "```yaml\n"
                    "📺 Xem video chất lượng cao\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 tháng    │     35,000đ    │\n"
                    "│ 3 tháng    │    100,000đ    │\n"
                    "│ 1 năm      │    350,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "```\n"
                    "🔥 **Đặc quyền:**\n"
                    "• 🚫 Chặn toàn bộ quảng cáo\n"
                    "• ⬇️ Tải video offline\n"
                    "• 🎵 YouTube Music miễn phí\n"
                    "• 📱 Phát nền trên mobile"
                ),
                color=0xFF0000
            )
            e.set_footer(text="📺 Ad-free experience guaranteed!")
        elif choice == "netflix":
            e = discord.Embed(
                title="🎬 **NETFLIX PREMIUM**",
                description=(
                    "```yaml\n"
                    "🍿 Giải trí không giới hạn\n"
                    "┌─────────────────────────────┐\n"
                    "│ 1 tháng    │     60,000đ    │\n"
                    "│ 3 tháng    │    170,000đ    │\n"
                    "│ 1 năm      │    600,000đ    │\n"
                    "└─────────────────────────────┘\n"
                    "```\n"
                    "🌟 **Gói Premium:**\n"
                    "• 📱 Xem trên mọi thiết bị\n"
                    "• 4️⃣ 4K Ultra HD quality\n"
                    "• ⬇️ Download offline\n"
                    "• 👥 Chia sẻ tài khoản"
                ),
                color=0xE50914
            )
            e.set_footer(text="🎭 Thế giới giải trí trong tầm tay!")
        await interaction.response.send_message(embed=e, ephemeral=True)

    menu.callback = menu_callback
    view = discord.ui.View()
    view.add_item(menu)

    await ctx.send(embed=embed, view=view)

# Lệnh cập nhật giá (chỉ admin)
@bot.command(name="updategia")
@commands.has_permissions(administrator=True)
async def update_gia(ctx):
    embed = discord.Embed(
        title="⚙️ **CẬP NHẬT GIÁ SẢN PHẨM**",
        description=(
            "```yaml\n"
            "📋 BẢNG GIÁ HIỆN TẠI:\n"
            "┌─────────────────────────────────┐\n"
            "│ Discord Nitro:                  │\n"
            "│  • 1 tháng: 90k                │\n"
            "│  • 2 tháng: 150k               │\n"
            "│  • 4 tháng: 120k               │\n"
            "│  • 1 năm: 850k                 │\n"
            "├─────────────────────────────────┤\n"
            "│ Server Boost:                   │\n"
            "│  • 1 Boost: 90k                │\n"
            "│  • 2 Boost: 170k               │\n"
            "│  • 6 tháng: 500k               │\n"
            "├─────────────────────────────────┤\n"
            "│ Spotify Premium:                │\n"
            "│  • 1 tháng: 20k                │\n"
            "│  • 3 tháng: 55k                │\n"
            "│  • 1 năm: 200k                 │\n"
            "├─────────────────────────────────┤\n"
            "│ YouTube Premium:                │\n"
            "│  • 1 tháng: 35k                │\n"
            "│  • 3 tháng: 100k               │\n"
            "│  • 1 năm: 350k                 │\n"
            "├─────────────────────────────────┤\n"
            "│ Netflix Premium:                │\n"
            "│  • 1 tháng: 60k                │\n"
            "│  • 3 tháng: 170k               │\n"
            "│  • 1 năm: 600k                 │\n"
            "└─────────────────────────────────┘\n"
            "```"
        ),
        color=0xFFD700
    )
    embed.set_footer(text="💡 Liên hệ dev để cập nhật giá mới trong code", icon_url="https://cdn.discordapp.com/emojis/1303541197167657030.png")
    embed.add_field(
        name="📝 **Hướng dẫn cập nhật:**",
        value="• Chỉnh sửa trực tiếp trong code\n• Restart bot sau khi update\n• Kiểm tra lại bằng lệnh `!store`",
        inline=False
    )
    
    await ctx.send(embed=embed)

@update_gia.error
async def update_gia_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ **Chỉ admin mới có thể sử dụng lệnh này!**")

# Khi bot online
@bot.event
async def on_ready():
    print(f"✅ Bot đã đăng nhập thành công: {bot.user}")
    print(f"📋 Lệnh: !store - Xem bảng giá")
    print(f"⚙️ Lệnh: !updategia - Cập nhật giá (Admin)")
import os
bot.run(os.getenv("DISCORD_TOKEN"))

