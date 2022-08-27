package org.awcator;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class tcpserver {
    ServerSocket server;
    static SocketServerThread SocketServerThread;

    public tcpserver() {
        SocketServerThread = new SocketServerThread();
        SocketServerThread.run();
    }

    class SocketServerThread extends Thread {

        @Override
        public void run() {

            try {
                server = new ServerSocket(5555);
                //while (!server.isClosed()) {
                try {
                    //Open 4 server therads to handle to 4 parllel connectivity
                    SocketServerReplyThread machine1 = new SocketServerReplyThread("Machine1");
                    machine1.start();
                    SocketServerReplyThread machine2 = new SocketServerReplyThread("Machine2");
                    machine2.start();
                    SocketServerReplyThread machine3 = new SocketServerReplyThread("Machine3");
                    machine3.start();
                    SocketServerReplyThread machine4 = new SocketServerReplyThread("Machine4");
                    machine4.start();
                    System.out.println("Server Successfully started with Four Open parallel Connections");

                } catch (Exception e) {
                    e.printStackTrace();
                }
                //}
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }

    class SocketServerReplyThread extends Thread {

        public SocketServerReplyThread(String x) {
            setName(x);
        }

        @Override
        public void run() {
            try {
                //Socket handlers restart once task is over to handle new requests
                while (true) {
                    Socket client = server.accept();
                    System.out.println(getName() + ": Client Connected");
                    InputStream InputStream = client.getInputStream();
                    int p = 0;
                    /*
                    while ((bytesRead = InputStream.read(buffer)) != -1) {
                        byteArrayOutputStream.write(buffer, p, bytesRead);
                        p=bytesRead;
                        response = byteArrayOutputStream.toString("UTF-8");
                        System.out.println(response+"  "+bytesRead);
                        InputStream.mark(bytesRead);
                    }*/

                    int c;
                    String raw = "";
                    //Barcode:Machine;
                    do {
                        System.out.println(getName() + "says, ");
                        while ((c = InputStream.read()) != -1) {
                            if (c == ';') {
                                System.out.println(raw);
                                //performTask(raw.substring(0, raw.indexOf(":")), raw.substring(raw.indexOf(":") + 1));
                                raw = "";
                                continue;
                            }
                            raw += (char) c;
                        }
                    } while (InputStream.available() > 0);
                }
            } catch (Exception e) {
                System.out.println("Error Occured " + e);
            }
        }

        public void performTask(String barcode, String Machine) throws Exception {
            System.out.println(45);
            //Runtime.getRuntime().exec("python a.py 45 machine1");
            System.setProperty("user.dir", "/home/Awcator/");
            System.out.println(System.getProperty("user.dir"));
            ProcessBuilder pb = new ProcessBuilder("/bin/python", "/home/Awcator/a.py", barcode, Machine);
            pb.redirectErrorStream(true);

            /* Start the process */
            Process proc = pb.start();
            System.out.println("Process started !");

            /* Read the process's output */
            String line;
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    proc.getInputStream()));
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }

            /* Clean-up */
            proc.destroy();
            System.out.println("Process ended !");
        }
    }
}
