<?php

namespace App\Mail;

use App\Models\Pemesanan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EticketMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pemesanan $pemesanan;

    // Inisialisasi data pemesanan dpt dr controller pembayaran
    public function __construct(Pemesanan $pemesanan)
    {
        $this->pemesanan = $pemesanan;
    }

    // otomatis panggil Mail::send()
    public function build()
    {
        return $this->makeEmail();
    }
    
    private function makeEmail()
    {
        // Subjek email kode tiket
        $subject = 'E-ticket Pembayaran Berhasil - ' . ($this->pemesanan->kode_tiket);

        // subjeknya isi header dari subject Email
        // Panggil view emails.eticket
        return $this->subject($subject)->view('emails.eticket');
    }
}
