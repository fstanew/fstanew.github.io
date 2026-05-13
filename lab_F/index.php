<?php
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Autoloader
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/lib/';
    if (0 === strpos($class, $prefix)) {
        $relative = substr($class, strlen($prefix));
        $file = $baseDir . str_replace('\\', '/', $relative) . '.php';
        if (file_exists($file)) { require $file; }
    }
});

// Zmienne domyślne
$inputData = '';
$inputFormat = 'CSV';
$outputFormat = 'JSON';
$outputData = '';

// Odbieranie danych z POST lub ciasteczek
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['input_data'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'CSV';
    $outputFormat = $_POST['output_format'] ?? 'JSON';

    setcookie('input_data', $inputData, time() + 3600);
    setcookie('input_format', $inputFormat, time() + 3600);
    setcookie('output_format', $outputFormat, time() + 3600);
} else {
    $inputData = $_COOKIE['input_data'] ?? $inputData;
    $inputFormat = $_COOKIE['input_format'] ?? $inputFormat;
    $outputFormat = $_COOKIE['output_format'] ?? $outputFormat;
}

// Konwersja, jeśli są dane
if (!empty($inputData)) {
    $serializer = new \App\Serializer([
        new \App\Encoder\JsonEncoder(),
        new \App\Encoder\YamlEncoder(),
        new \App\Encoder\TabularEncoder()
    ]);
    
    try {
        $outputData = $serializer->convert($inputData, $inputFormat, $outputFormat);
    } catch (\Throwable $e) {
        $outputData = "Błąd: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter Formatów</title>
</head>
<body>
    <h1>Konwerter (Stanew Filip)</h1>
    
    <form method="POST">
        <div>
            <label>Wejście:</label><br>
            <textarea name="input_data" rows="10" cols="60"><?= htmlspecialchars($inputData) ?></textarea>
        </div>
        
        <div>
            <label>Format wejściowy:</label>
            <select name="input_format">
                <option <?= $inputFormat === 'CSV' ? 'selected' : '' ?>>CSV</option>
                <option <?= $inputFormat === 'SSV' ? 'selected' : '' ?>>SSV</option>
                <option <?= $inputFormat === 'TSV' ? 'selected' : '' ?>>TSV</option>
                <option <?= $inputFormat === 'JSON' ? 'selected' : '' ?>>JSON</option>
                <option <?= $inputFormat === 'YAML' ? 'selected' : '' ?>>YAML</option>
            </select>
        </div>

        <div>
            <label>Format wyjściowy:</label>
            <select name="output_format">
                <option <?= $outputFormat === 'CSV' ? 'selected' : '' ?>>CSV</option>
                <option <?= $outputFormat === 'SSV' ? 'selected' : '' ?>>SSV</option>
                <option <?= $outputFormat === 'TSV' ? 'selected' : '' ?>>TSV</option>
                <option <?= $outputFormat === 'JSON' ? 'selected' : '' ?>>JSON</option>
                <option <?= $outputFormat === 'YAML' ? 'selected' : '' ?>>YAML</option>
            </select>
        </div>

        <button type="submit">Konwertuj</button>
    </form>

    <h2>Wynik konwersji:</h2>
    <pre style="background: #f4f4f4; padding: 10px; border: 1px solid #ccc; min-height: 50px;">
<?= htmlspecialchars($outputData) ?>
    </pre>
</body>
</html>
