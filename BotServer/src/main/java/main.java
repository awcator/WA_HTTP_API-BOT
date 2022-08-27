import org.awcator.tcpserver;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;

public class main {
    public static void main(String args[])throws Exception{
        System.out.println("WhatsAppBot server 0.1");
        System.out.println("Server is Running on Port: 5555; written Entirly in Java.\n Possbile NetworkInterface Adapter provides these IP's: ");
        Enumeration e = NetworkInterface.getNetworkInterfaces();
        while (e.hasMoreElements()) {
            NetworkInterface n = (NetworkInterface) e.nextElement();
            Enumeration ee = n.getInetAddresses();
            while (ee.hasMoreElements()) {
                InetAddress i = (InetAddress) ee.nextElement();
                System.out.println(i.getHostAddress());
            }
        }
        tcpserver botserver=new tcpserver();
    }
}
