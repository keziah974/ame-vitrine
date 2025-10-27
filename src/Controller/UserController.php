<?php

namespace App\Controller;

use Symfony\Component\Mime\Email;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(Request $request, MailerInterface $mailer): Response
    {
        if($request->request->get("nom") && $request->request->get('prenom') && $email = $request->request->get('email') && $objet = $request->request->get('objet') && $message = $request->request->get('content')){
            $nom = $request->request->get('nom');
            $prenom = $request->request->get('prenom');
            $email = $request->request->get('email');
            $objet = "Réception mail $email: ".$request->request->get('objet');
            $message = "Nom : $nom \nPrénom : $prenom \nEmail: $email \n\n".$request->request->get('content');

            $adminmail = new PHPMailer(true);
            $returnmail = new PHPMailer(true);
            try {


                //  Envoie du mail pour l'équipe ÂME

                // Config Gmail SMTP
                $adminmail->isSMTP();
                $adminmail->Host = 'smtp.gmail.com';
                $adminmail->SMTPAuth = true;
                $adminmail->Username = 'projet.ame.admln@gmail.com';
                $adminmail->Password = 'tcnddivolgkjjugo'; // Ton mot de passe d'application Gmail
                $adminmail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $adminmail->Port = 587;
    
                // Email
                $adminmail->setFrom('projet.ame.admln@gmail.com', 'Équipe ÂME');
                $adminmail->addAddress('projet.ame.admln@gmail.com');
                $adminmail->Subject = $objet;
                $adminmail->Body = "$message";
    
                $adminmail->send();

                // Envoie du mail d'accusé reception pour l'utilisateur

                // Config Gmail SMTP
                $returnmail->isSMTP();
                $returnmail->Host = 'smtp.gmail.com';
                $returnmail->SMTPAuth = true;
                $returnmail->Username = 'projet.ame.admln@gmail.com';
                $returnmail->Password = 'tcnddivolgkjjugo'; // Ton mot de passe d'application Gmail
                $returnmail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $returnmail->Port = 587;
    
                // Email
                $returnmail->setFrom('projet.ame.admln@gmail.com', 'Équipe ÂME');
                $returnmail->addAddress($email);
                $returnmail->Subject = "Merci pour votre message";
                $returnmail->Body = "Bonjour $prenom,
                Merci pour votre message, nous vous répondrons très bientôt.
                — L’équipe ÂME";
    
                $returnmail->send();
                return $this->redirectToRoute('app_conf_mail'); // à adapter selon ta route
            } catch (Exception $e) {
                dd($adminmail->ErrorInfo);
                $this->addFlash('error','Erreur PHPMailer : ' . $adminmail->ErrorInfo);
            }
            return $this->redirectToRoute('home'); // à adapter selon ta route

        }
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    #[Route('/test-mail', name: 'app_test_mail')]
    public function test(MailerInterface $mailer): Response
    {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);

        $mail = new PHPMailer(true);

        try {
            // Config Gmail SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'projet.ame.admln@gmail.com';
            $mail->Password = 'tcnddivolgkjjugo'; // Ton mot de passe d'application Gmail
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Email
            $mail->setFrom('projet.ame.admln@gmail.com', 'Équipe ÂME');
            $mail->addAddress('projet.ame.admln@gmail.com');
            $mail->Subject = 'Test de mail avec PHPMailer';
            $mail->Body = 'Ceci est un test envoyé depuis PHPMailer.';

            $mail->send();
            return new Response('Mail envoyé avec PHPMailer.');
        } catch (Exception $e) {
            return new Response('Erreur PHPMailer : ' . $mail->ErrorInfo);
        }
    }
    #[Route('/confirmation', name: 'app_conf_mail')]
    public function confirmation(MailerInterface $mailer): Response
    {

        return $this->render('user/conf_mail.html.twig');
    }
    #[Route('/carte', name: 'carte')]
    public function carte(MailerInterface $mailer): Response
    {

        return $this->render('user/carte.html.twig');
    }
}
