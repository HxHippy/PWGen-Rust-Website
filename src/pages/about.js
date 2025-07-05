import React from 'react';
import Layout from '@theme/Layout';

export default function About() {
  return (
    <Layout
      title="About PWGen-Rust"
      description="Meet the creator of PWGen-Rust - from learning Rust to building a comprehensive password manager in 8 months">
      <main>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--12">
              <h1>About PWGen-Rust</h1>
              <p className="hero__subtitle">
                The story of how a passion for learning Rust became a comprehensive password management solution
              </p>
            </div>
          </div>

          {/* Brian Gagne / HxHippy */}
          <div className="row margin-vert--lg">
            <div className="col col--3">
              <div className="text--center">
                <img 
                  src="/img/hxhippy.jpeg" 
                  alt="Brian Gagne"
                  style={{
                    borderRadius: '50%',
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    border: '4px solid var(--ifm-color-primary)'
                  }}
                />
              </div>
            </div>
            <div className="col col--9">
              <h2>Brian Gagne</h2>
              <h3 style={{color: 'var(--ifm-color-primary)', fontWeight: 'normal'}}>
                AI Specialist & Cybersecurity Enthusiast | Co-Founder of Kief Studio
              </h3>
              <p style={{fontSize: '1.1em', fontStyle: 'italic', color: 'var(--ifm-color-primary)'}}>
                "From zero Rust knowledge to PWGen-Rust in 8 months"
              </p>
              
              <div className="margin-bottom--md">
                <h4>🚀 The Journey</h4>
                <p>
                  Brian's journey with PWGen-Rust began on November 1st, 2024, when he decided to learn Rust. 
                  Just 35 days later, on December 6th, 2024, he made his first commit to what would inspire
                  a comprehensive password management solution. This rapid progression from beginner to 
                  building production-ready software showcases the power of focused learning and practical application.
                <blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;m going to learn <a href="https://twitter.com/rustlang?ref_src=twsrc%5Etfw">@rustlang</a></p>&mdash; HxHippy (@HxHippy) <a href="https://twitter.com/HxHippy/status/1852278656472613014?ref_src=twsrc%5Etfw">November 1, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                </p>
              </div>

              <div className="margin-bottom--md">
                <h4>💡 The Problem & Solution</h4>
                <p>
                  PWGen-Rust was born from a real-world frustration: the complexity of maintaining proper password 
                  logic across different framework guidelines. Brian envisioned a future-ready application that 
                  serves everyone - from enterprises needing flexible database configurations, to security-conscious 
                  users wanting external hardware storage, to everyday users seeking modern security without complexity.
                </p>
              </div>

              <div className="margin-bottom--md">
                <h4>🛠️ Professional Background</h4>
                <p>
                  With expertise spanning AI development (since 2016), Python, TypeScript, ERP Systems, and Cloud 
                  infrastructure, Brian brings a unique perspective to security challenges. As a Cisco Certified 
                  Ethical Hacker (CCEH), he combines formal credentials with real-world experience managing servers 
                  and cloud infrastructure.
                </p>
                <p>
                  Brian co-founded <strong>Kief Studio</strong> with his wife, focusing on AI integration and 
                  technology consulting. His approach to cybersecurity is rooted in continuous learning - 
                  embracing the role of "knowledge sponge" and believing that there's always something new to 
                  discover, especially when surrounded by experts who push the boundaries of what's possible.
                </p>
              </div>

              <div className="margin-bottom--md">
                <p style={{fontSize: '0.9em', color: 'var(--ifm-color-secondary)'}}>
                  <em>Friends and family know him as "Hippy" (from his gaming handle HxHippy), but professionally, 
                  he goes by Brian.</em>
                </p>
              </div>
              
              <div className="margin-top--md">
                <h4>Connect with Brian:</h4>
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <a href="https://www.linkedin.com/in/briansgagne/" target="_blank" rel="noopener noreferrer" 
                     className="button button--primary button--sm">
                    💼 LinkedIn
                  </a>
                  <a href="https://x.com/HxHippy" target="_blank" rel="noopener noreferrer" 
                     className="button button--secondary button--sm">
                    🐦 @HxHippy
                  </a>
                  <a href="https://hxhippy.com" target="_blank" rel="noopener noreferrer" 
                     className="button button--secondary button--sm">
                    🌐 Website
                  </a>
                  <a href="https://github.com/HxHippy" target="_blank" rel="noopener noreferrer" 
                     className="button button--secondary button--sm">
                    🐱 GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr className="margin-vert--xl" />

          {/* Organizations */}
          <div className="row">
            <div className="col col--12">
              <h2>The Ecosystem</h2>
              <p>PWGen-Rust exists within a broader ecosystem of AI and cybersecurity innovation:</p>
            </div>
          </div>

          <div className="row margin-vert--lg">
            {/* Kief Studio */}
            <div className="col col--6">
              <div className="card">
                <div className="card__header text--center">
                  <picture>
                    <source media="(prefers-color-scheme: dark)" srcSet="/img/kief-studio-logo-light.png" />
                    <img 
                      src="/img/kief-studio-logo-dark.png" 
                      alt="Kief Studio"
                      style={{height: '60px', objectFit: 'contain'}}
                    />
                  </picture>
                </div>
                <div className="card__body">
                  <h3>Kief Studio</h3>
                  <p><strong>AI Integration & Technology Consulting</strong></p>
                  <p>
                    Co-founded by Brian and his wife, Kief Studio specializes in AI integration and technology consulting, 
                    helping organizations navigate the complex landscape of artificial intelligence adoption while maintaining 
                    security and compliance.
                  </p>
                  <div className="text--center margin-top--md">
                    <a href="https://kief.studio" target="_blank" rel="noopener noreferrer" 
                       className="button button--primary">
                      Visit Kief Studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* TRaViS */}
            <div className="col col--6">
              <div className="card">
                <div className="card__header text--center">
                  <picture>
                    <source media="(prefers-color-scheme: dark)" srcSet="/img/travis-text-white.png" />
                    <img 
                      src="/img/travis-text-dark.png" 
                      alt="TRaViS"
                      style={{height: '60px', objectFit: 'contain'}}
                    />
                  </picture>
                </div>
                <div className="card__body">
                  <h3>TRaViS</h3>
                  <p><strong>Threat Reconnaissance And Vulnerability Identification System</strong></p>
                  <p>
                    TRaViS provides AI-powered External Attack Surface Management (EASM) without asset caps, 
                    offering comprehensive threat intelligence and vulnerability identification for modern 
                    cybersecurity needs. For advanced cybersecurity expertise, connect with TRaViS.
                  </p>
                  <div className="text--center margin-top--md">
                    <a href="https://travisasm.com" target="_blank" rel="noopener noreferrer" 
                       className="button button--primary">
                      Visit TRaViS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="margin-vert--xl" />

          {/* Mission Statement */}
          <div className="row">
            <div className="col col--12">
              <h2>Our Mission</h2>
              <div className="hero hero--primary">
                <div className="container">
                  <div className="hero__body">
                    <h3 className="hero__title">
                      Building Security-First Solutions for Everyone
                    </h3>
                    <p className="hero__subtitle">
                      We believe that enterprise-grade security shouldn't be reserved for large corporations. 
                      PWGen-Rust represents our commitment to democratizing cybersecurity tools, making 
                      military-grade encryption and memory-safe password management accessible to individuals, 
                      small businesses, and enterprises alike.
                    </p>
                    <p className="hero__subtitle">
                      Through the innovative use of Rust's memory safety guarantees and modern cryptographic 
                      standards, we're building the next generation of security tools that are both 
                      uncompromisingly secure and beautifully usable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="row margin-vert--lg">
            <div className="col col--12">
              <h2>Get In Touch</h2>
              <p>
                Interested in collaborating, contributing, or learning more about our work? 
                We'd love to hear from you.
              </p>
              <div className="row">
                <div className="col col--4">
                  <h4>🔒 Security Issues</h4>
                  <p>Report vulnerabilities responsibly:</p>
                  <a href="mailto:security@pwgenrust.dev">security@pwgenrust.dev</a>
                </div>
                <div className="col col--4">
                  <h4>💬 General Inquiries</h4>
                  <p>Questions or feedback:</p>
                  <a href="https://github.com/HxHippy/PWGen/discussions" target="_blank" rel="noopener noreferrer">
                    GitHub Discussions
                  </a>
                </div>
                <div className="col col--4">
                  <h4>🤝 Business Partnerships</h4>
                  <p>Collaboration opportunities:</p>
                  <a href="https://kief.studio/contact" target="_blank" rel="noopener noreferrer">
                    Contact Kief Studio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
