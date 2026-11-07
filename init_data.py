import json
import os

os.makedirs('data', exist_ok=True)

# 1. users.json
users = [
    {
        "id": "usr_demo123",
        "name": "Rajesh Sharma",
        "businessName": "Café Verona & Bistro",
        "mobile": "+919876543210",
        "email": "rajesh@cafeverona.in",
        "plan": "growth",
        "planPrice": 299,
        "createdAt": "2026-01-15T10:00:00.000Z",
        "role": "merchant",
        "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
        "googleRating": 4.9,
        "reviewCount": 384
    }
]
with open('data/users.json', 'w', encoding='utf-8') as f:
    json.dump(users, f, indent=2)

# 2. reviews.json (Google Business Profile Live Stream)
reviews = [
    {
        "id": "rev_001",
        "author": "Ananya Roy",
        "rating": 5,
        "date": "2026-11-06T18:42:00.000Z",
        "text": "Visited Café Verona yesterday evening. The Truffle Mushroom Pasta was sensational and the cold brew was super fresh! Staff was prompt and very polite. Will definitely visit again!",
        "tags": ["Truffle Pasta", "Cold Brew", "Prompt Staff"],
        "reply": "Thank you so much Ananya! We are delighted that you loved our signature Truffle Mushroom Pasta. Looking forward to hosting you again soon! — Team Café Verona",
        "repliedAt": "2026-11-06T18:43:12.000Z",
        "replyStatus": "autopilot_sent",
        "source": "Google Maps"
    },
    {
        "id": "rev_002",
        "author": "Vikram Sethi",
        "rating": 5,
        "date": "2026-11-05T14:15:00.000Z",
        "text": "Best Italian cafe in Indiranagar! Woodfired Margherita pizza was authentic with crisp crust. 10/10 dining experience.",
        "tags": ["Woodfired Pizza", "Great Ambiance"],
        "reply": "Hi Vikram, thanks a lot for the wonderful review! So glad you enjoyed the woodfired crust. See you again next weekend!",
        "repliedAt": "2026-11-05T14:16:05.000Z",
        "replyStatus": "autopilot_sent",
        "source": "Google Maps"
    },
    {
        "id": "rev_003",
        "author": "Pooja Hegde",
        "rating": 5,
        "date": "2026-11-04T20:30:00.000Z",
        "text": "Staff is remarkably courteous. Ambience is peaceful with great background music. Loved their tiramisu!",
        "tags": ["Courteous Staff", "Tiramisu", "Music"],
        "reply": "Thank you Pooja! Our pastry chef will be thrilled to hear your praise for the tiramisu. Cheers!",
        "repliedAt": "2026-11-04T20:31:00.000Z",
        "replyStatus": "autopilot_sent",
        "source": "Google Maps"
    }
]
with open('data/reviews.json', 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2)

# 3. standees.json
standees = [
    {
        "id": "stn_001",
        "title": "Main Billing Counter Standee",
        "color": "#0B3D3B",
        "qrSlug": "verona-counter",
        "tableNo": "Billing Desk",
        "scans": 1140,
        "reviewsGenerated": 972,
        "conversionRate": "85.2%",
        "hardwareType": "Matte Acrylic A6 + NTAG213 NFC",
        "status": "active"
    },
    {
        "id": "stn_002",
        "title": "Outdoor Garden Table Tent",
        "color": "#14B8A6",
        "qrSlug": "verona-garden",
        "tableNo": "Tables 1-8",
        "scans": 702,
        "reviewsGenerated": 596,
        "conversionRate": "84.9%",
        "hardwareType": "Wooden Base Acrylic + NFC",
        "status": "active"
    }
]
with open('data/standees.json', 'w', encoding='utf-8') as f:
    json.dump(standees, f, indent=2)

# 4. shield_logs.json (Private Grievance Interceptions)
shield_logs = [
    {
        "id": "shd_001",
        "date": "2026-11-07T11:20:00.000Z",
        "tableNo": "Table 4",
        "customerName": "Amit Desai",
        "customerPhone": "+919811223344",
        "rating": 2,
        "issue": "Slow drink delivery",
        "comment": "Food was delicious but the mojito took 25 minutes to arrive.",
        "whatsappAlertSent": True,
        "resolvedBy": "Rajesh (Manager)",
        "resolutionStatus": "resolved",
        "notes": "Offered complimentary dessert. Customer was very satisfied with quick manager response."
    },
    {
        "id": "shd_002",
        "date": "2026-11-06T19:40:00.000Z",
        "tableNo": "Table 11",
        "customerName": "Sneha Sen",
        "customerPhone": "+919822334455",
        "rating": 3,
        "issue": "AC too cold",
        "comment": "Air conditioning was directly blowing on our table. Mentioned to waiter.",
        "whatsappAlertSent": True,
        "resolvedBy": "Sunil (Supervisor)",
        "resolutionStatus": "resolved",
        "notes": "Adjusted thermostat immediately. Customer retained."
    }
]
with open('data/shield_logs.json', 'w', encoding='utf-8') as f:
    json.dump(shield_logs, f, indent=2)

# 5. templates.json (WhatsApp templates)
templates = {
    "otp": "Your Reviewwo QR verification code is *{{otp}}*.\n\nEnter this code in your browser to sign in to your dashboard.\nValid for 5 minutes. Do not share with anyone.",
    "grievance_alert": "⚠️ *Private Shield Alert — Café Verona*\n\n*Rating:* {{stars}} Stars\n*Table / Area:* {{table_no}}\n*Guest Name:* {{customer_name}}\n*Guest Phone:* {{customer_phone}}\n*Feedback:* \"{{feedback}}\"\n\n👉 *Action Required:* Tap here to chat with guest on WhatsApp to resolve: https://wa.me/{{clean_phone}}",
    "review_invite": "Hi {{customer_name}}! Thank you for visiting Café Verona today ☕\n\nCould you take 10 seconds to share your 5-star experience on Google? AI has pre-drafted your review:\n👉 {{review_link}}\n\nWe appreciate your support!"
}
with open('data/templates.json', 'w', encoding='utf-8') as f:
    json.dump(templates, f, indent=2)

# 6. whatsapp_session.json
wa_session = {
    "status": "CONNECTED",
    "phoneNumber": "+919876543210",
    "deviceName": "Reviewwo WhatsApp Gateway (Sovereign Socket)",
    "connectedAt": "2026-11-07T08:00:00.000Z",
    "batteryLevel": 88,
    "totalDispatches": 1420,
    "smsFeesSaved": "₹2,840"
}
with open('data/whatsapp_session.json', 'w', encoding='utf-8') as f:
    json.dump(wa_session, f, indent=2)

print('Initialized data/ files successfully.')
