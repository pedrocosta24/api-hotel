POST de users
{
    "name": "Diogo",
    "email": "gmail@diogo.com",
    "password": "dkoawdkdk",
    "birthday": 1636730759347,
    "address": "Rua das ruas, Paços de Ferreira",
    "nif": 284732927,
    "role": "ADMIN"
}

POST de rooms
{
    "room_no": "A100",
    "type": "single",
    "no_beds": 123,
    "capacity": 3,
    "characteristics": ["wifi"],
    "price_night": 12,
    "images": "asda",
    "bookings": [{
        "user": {
            "name": "Diogo",
            "email": "gmail@diogo.com",
            "password": "dkoawdkdk",
            "birthday": 1636730759347,
            "address": "Rua das ruas, Paços de Ferreira",
            "nif": 284732927,
            "role": "ADMIN"
        },
        "guests_no": 6,
        "extras": ["asd"],
        "reserved": {
            "from": 1636730759347,
            "to": 1636730759347
        },
        "nights_no": 3,
        "final_price": 4
    }]
}