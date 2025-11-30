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

    public function __construct(Pemesanan $pemesanan)
    {
        $this->pemesanan = $pemesanan;
    }

    public function build()
    {
        $subject = 'E-ticket Pembayaran Berhasil - ' . ($this->pemesanan->kode_tiket ?? 'Pemesanan');

        return $this->subject($subject)->view('emails.eticket');
    }
}
