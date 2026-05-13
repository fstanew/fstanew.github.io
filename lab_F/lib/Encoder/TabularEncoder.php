<?php
namespace App\Encoder;

class TabularEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return in_array($format, ['CSV', 'SSV', 'TSV']);
    }

    private function getSeparator(string $format): string {
        return match ($format) {
            'CSV' => ',',
            'SSV' => ';',
            'TSV' => "\t",
            default => ','
        };
    }

    public function decode(string $data, string $format = ''): array {
        if (trim($data) === '') return [];
        $separator = $this->getSeparator($format);
        $lines = explode("\n", trim($data));
        
        $headers = str_getcsv(array_shift($lines), $separator);
        $result = [];

        foreach ($lines as $line) {
            $values = str_getcsv($line, $separator);
            $row = [];
            foreach ($headers as $i => $header) {
                $row[trim($header)] = isset($values[$i]) ? trim($values[$i]) : '';
            }
            $result[] = $row;
        }
        return $result;
    }

    public function encode(array $data, string $format = ''): string {
        if (empty($data)) return '';
        $separator = $this->getSeparator($format);
        $headers = array_keys($data[0]);
        
        $lines = [implode($separator, $headers)];
        foreach ($data as $row) {
            $lines[] = implode($separator, array_values($row));
        }
        return implode("\n", $lines);
    }
}
