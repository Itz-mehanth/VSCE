param([string]$vsixPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($vsixPath)
$entries = $zip.Entries | Where-Object { $_.FullName -like "extension/*" }
$zip.Entries | Where-Object { $_.Name -match "icon|package.json" } | Select-Object FullName, Length
$zip.Dispose()
