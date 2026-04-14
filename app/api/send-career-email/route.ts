import { Resend } from "resend";
import { NextResponse } from "next/server";

// To use this, the user needs to install resend: npm install resend
// and add RESEND_API_KEY to their .env file
export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const body = await request.json();
    const { fullName, email, githubUrl, portfolioUrl, resumeUrl, projectLinks, message } = body;

    console.log("Attempting to send email with:", { 
      to: process.env.CAREER_NOTIFICATION_EMAIL,
      from: process.env.CAREER_SENDER_EMAIL 
    });

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing from environment variables");
    }

    const { data, error } = await resend.emails.send({
      from: `Evoc Labs <${process.env.CAREER_SENDER_EMAIL || "onboarding@resend.dev"}>`,
      to: [process.env.CAREER_NOTIFICATION_EMAIL || ""],
      subject: `New Career Application: ${fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #08070b; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin-bottom: 24px;">New Application Received</h1>
          
          <div style="background-color: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Candidate Name</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 500;">${fullName}</p>
          </div>

          <div style="background-color: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Email Address</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 500;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
          </div>

          <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            ${githubUrl ? `
              <div style="background-color: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; font-size: 12px; color: #a1a1aa;">GitHub</p>
                <a href="${githubUrl}" style="display: block; margin-top: 4px; font-size: 14px; color: #3b82f6; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${githubUrl}</a>
              </div>
            ` : ""}
            ${portfolioUrl ? `
              <div style="background-color: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; font-size: 12px; color: #a1a1aa;">Portfolio</p>
                <a href="${portfolioUrl}" style="display: block; margin-top: 4px; font-size: 14px; color: #3b82f6; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${portfolioUrl}</a>
              </div>
            ` : ""}
          </div>

          ${resumeUrl ? `
            <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Resume Link</p>
              <a href="${resumeUrl}" style="display: block; margin-top: 4px; font-size: 16px; color: #3b82f6; text-decoration: none;">View Resume</a>
            </div>
          ` : ""}

          ${projectLinks ? `
            <div style="background-color: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Projects</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #d4d4d8; line-height: 1.5;">${projectLinks}</p>
            </div>
          ` : ""}

          ${message ? `
            <div style="background-color: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Cover Message</p>
              <p style="margin: 12px 0 0 0; font-size: 15px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          ` : ""}

          <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); pt: 24px; text-align: center;">
            <p style="font-size: 12px; color: #71717a;">Sent from Evoc Labs Career Portal</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error Detail:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Internal API Error:", err);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
