$ErrorActionPreference = "Stop"

Write-Host "`n==============================================="
Write-Host "   VibeMates Full-Stack Integration Verification"
Write-Host "===============================================`n"

# 1. Frontend
Write-Host "1. Testing Frontend HTTP (Port 3000)..."
$fe = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing
Write-Host "   Frontend Status: $($fe.StatusCode) OK"

# 2. Health Check
Write-Host "`n2. Testing Backend Health (Port 5000)..."
$health = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/health'
Write-Host "   Backend App Name: $($health.appName)"
Write-Host "   Storage Mode: $($health.storageMode)"

# 3. 1-Click Demo Login
Write-Host "`n3. Testing 1-Click Demo Login (Arun Kumar)..."
$body = @{ email = 'arun@college.edu' } | ConvertTo-Json
$auth = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/auth/demo-login' -Method Post -Body $body -ContentType 'application/json'
Write-Host "   Logged In User: $($auth.user.name) ($($auth.user.course))"
$token = $auth.token
$headers = @{
    Authorization = "Bearer $token"
}

# 4. Matches with Algorithm Scores
Write-Host "`n4. Testing Find Mates & Matching Algorithm..."
$matches = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/users/matches' -Headers $headers
Write-Host "   Total Mates Returned: $($matches.mates.Count)"
foreach ($m in $matches.mates | Select-Object -First 3) {
    Write-Host "   -> Peer: $($m.name) | Score: $($m.compatibilityScore)% | Can Teach: $($m.subjectsToTeach -join ', ')"
}

# 5. Direct Messages
Write-Host "`n5. Testing Real-Time Chat Thread with Rahul Verma..."
$chat = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/messages/direct/usr_rahul_102' -Headers $headers
Write-Host "   Messages count: $($chat.messages.Count)"
foreach ($msg in $chat.messages | Select-Object -First 2) {
    Write-Host "   -> [$($msg.sender.name)]: $($msg.content)"
}

# 6. Study Sessions
Write-Host "`n6. Testing Study Sessions (Upcoming & Completed)..."
$sessions = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/sessions/my-sessions' -Headers $headers
Write-Host "   Upcoming sessions count: $($sessions.upcoming.Count)"
if ($sessions.upcoming.Count -gt 0) {
    Write-Host "   -> Upcoming: $($sessions.upcoming[0].title) ($($sessions.upcoming[0].date) at $($sessions.upcoming[0].time))"
}

# 7. Study Groups
Write-Host "`n7. Testing Peer Study Groups..."
$groups = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/groups' -Headers $headers
Write-Host "   Total Study Groups: $($groups.groups.Count)"
foreach ($g in $groups.groups | Select-Object -First 3) {
    Write-Host "   -> Group: $($g.name) ($($g.subject)) | Members: $($g.memberCount)"
}

# 8. Notifications
Write-Host "`n8. Testing Notification Alerts & Unread Count..."
$notifs = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/notifications' -Headers $headers
Write-Host "   Notifications: $($notifs.notifications.Count) | Unread: $($notifs.unreadCount)"

Write-Host "`n==============================================="
Write-Host "   ALL 8 FULL-STACK SYSTEM TESTS PASSED! 🚀"
Write-Host "===============================================`n"
