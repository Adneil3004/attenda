import jwt
import urllib.request
import json
token = jwt.encode({"sub": "d50a24aa-ba6c-48c0-bc37-a9a7a9de5641"}, "secret", algorithm="HS256")
req = urllib.request.Request("http://localhost:5263/api/Guests/groups/11111111-1111-1111-1111-111111111111", headers={"Authorization": f"Bearer {token}"})
try:
    urllib.request.urlopen(req)
except Exception as e:
    content = e.read().decode()
    # Extract just the <title> or the first few lines of the stack trace from the HTML response
    import re
    match = re.search(r'<title>(.*?)</title>', content)
    if match:
        print("EXCEPTION: " + match.group(1))
    else:
        print(content[:1000])
