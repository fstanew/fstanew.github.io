<?php
namespace App;

use App\Encoder\EncoderInterface;

class Serializer {
    /** @var EncoderInterface[] */
    private array $encoders;

    public function __construct(array $encoders) {
        $this->encoders = $encoders;
    }

    public function convert(string $data, string $inputFormat, string $outputFormat): string {
        if (trim($data) === '') return '';

        $decodedData = null;
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($inputFormat)) {
                $decodedData = $encoder->decode($data, $inputFormat);
                break;
            }
        }

        if ($decodedData === null) {
            return "Błąd: Brak dekodera dla formatu {$inputFormat}";
        }

        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($outputFormat)) {
                return $encoder->encode($decodedData, $outputFormat);
            }
        }

        return "Błąd: Brak enkodera dla formatu {$outputFormat}";
    }
}
