import datetime

# Sample data
users = [
    {"id": "ICB3AajpBpOU1XXIbLH17JNAWx03", "name": "Active User"},
    {"id": "0KYFx0QdMXfyKmpGdUouw4gJmYt1", "name": "Inactive User"}
]

services = [
    {"userId": "ICB3AajpBpOU1XXIbLH17JNAWx03", "createdAt": {"_seconds": 1736581777}},
    {"userId": "ICB3AajpBpOU1XXIbLH17JNAWx03", "createdAt": {"_seconds": 1736581111}},
    {"userId": "0KYFx0QdMXfyKmpGdUouw4gJmYt1", "createdAt": {"_seconds": 1730000000}},
]

# Threshold for recent activity (e.g., last 30 days)
threshold_seconds = 30 * 24 * 60 * 60
current_time = datetime.datetime.now().timestamp()

# Analyze user activity
user_activity = {}
for service in services:
    user_id = service["userId"]
    last_service_time = service["createdAt"]["_seconds"]
    if user_id not in user_activity:
        user_activity[user_id] = {
            "totalServices": 0,
            "lastServiceDate": last_service_time
        }
    user_activity[user_id]["totalServices"] += 1
    user_activity[user_id]["lastServiceDate"] = max(user_activity[user_id]["lastServiceDate"], last_service_time)

# Categorize users
active_users = []
inactive_users = []

for user in users:
    user_id = user["id"]
    if user_id in user_activity:
        last_active = user_activity[user_id]["lastServiceDate"]
        if current_time - last_active <= threshold_seconds:
            active_users.append(user)
        else:
            inactive_users.append(user)
    else:
        inactive_users.append(user)

print("Active Users:", active_users)
print("Inactive Users:", inactive_users)
