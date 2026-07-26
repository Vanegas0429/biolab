Get-ChildItem -Path 'C:\BIOLAB\biolab\Proyecto-Biolab-Frontend\src' -Recurse -Include '*.js','*.jsx' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match 'http://localhost:8000') {
        $newContent = $content -replace 'http://localhost:8000', 'http://77.42.120.211'
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($_.FullName)"
    }
}
Write-Host "Done replacing URLs."
