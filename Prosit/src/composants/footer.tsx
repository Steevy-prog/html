import Logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="mt-auto w-screen bg-white text-slate-800">
      <div className="w-full px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* company */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Archiva Logo" className="w-16 h-auto object-contain" />
            <span className="text-lg font-semibold">Archiva</span>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 grid place-items-center text-slate-700">
                {/* mail svg */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1.5 9.1691V17.75C1.5 19.4069 2.84315 20.75 4.5 20.75H19.5C21.1569 20.75 22.5 19.4069 22.5 17.75V9.1691L13.5723 14.6631C12.6081 15.2564 11.3919 15.2564 10.4277 14.6631L1.5 9.1691Z" fill="#262626"/><path d="M22.5 7.40783V7.25C22.5 5.59315 21.1569 4.25 19.5 4.25H4.5C2.84315 4.25 1.5 5.59315 1.5 7.25V7.40783L11.2139 13.3856C11.696 13.6823 12.304 13.6823 12.7861 13.3856L22.5 7.40783Z" fill="#262626"/></svg>
              </span>
              <span>info@archiva.com</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 grid place-items-center text-slate-700">
                {/* phone svg */}
                <svg width="20" height="20" viewBox="0 0 22 21" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0.5 3C0.5 1.34315 1.84315 0 3.5 0H4.87163C5.732 0 6.48197 0.585557 6.69064 1.42025L7.79644 5.84343C7.97941 6.5753 7.70594 7.34555 7.10242 7.79818L5.8088 8.7684C5.67447 8.86915 5.64527 9.01668 5.683 9.11969C6.81851 12.2195 9.28051 14.6815 12.3803 15.817C12.4833 15.8547 12.6309 15.8255 12.7316 15.6912L13.7018 14.3976C14.1545 13.7941 14.9247 13.5206 15.6566 13.7036L20.0798 14.8094C20.9144 15.018 21.5 15.768 21.5 16.6284V18C21.5 19.6569 20.1569 21 18.5 21H16.25C7.55151 21 0.5 13.9485 0.5 5.25V3Z" fill="#262626"/></svg>
              </span>
              <span>+237 600 000 000</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 grid place-items-center text-slate-700">
                {/* location svg */}
                <svg width="20" height="20" viewBox="0 0 24 25" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.5397 22.851C11.57 22.8685 11.5937 22.8821 11.6105 22.8915L11.6384 22.9071C11.8613 23.0294 12.1378 23.0285 12.3608 22.9075L12.3895 22.8915C12.4063 22.8821 12.43 22.8685 12.4603 22.851C12.5207 22.816 12.607 22.765 12.7155 22.6982C12.9325 22.5646 13.2388 22.3676 13.6046 22.1091C14.3351 21.5931 15.3097 20.8274 16.2865 19.8273C18.2307 17.8368 20.25 14.8462 20.25 11C20.25 6.44365 16.5563 2.75 12 2.75C7.44365 2.75 3.75 6.44365 3.75 11C3.75 14.8462 5.76932 17.8368 7.71346 19.8273C8.69025 20.8274 9.66491 21.5931 10.3954 22.1091C10.7612 22.3676 11.0675 22.5646 11.2845 22.6982C11.393 22.765 11.4793 22.816 11.5397 22.851ZM12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" fill="#262626"/></svg>
              </span>
              <span>Yassa, Douala/Cameroun</span>
            </div>
          </div>
        </div>

        {/* nav */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Accueil</h4>
          <ul className="text-sm space-y-2 text-slate-600">
            <li><a className="hover:text-slate-800" href="#">CERs</a></li>
            <li><a className="hover:text-slate-800" href="#">Mes CERs favoris</a></li>
            <li><a className="hover:text-slate-800" href="#">Gestion de CER</a></li>
          </ul>
        </div>

        {/* social */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Social Profiles</h4>
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-md bg-gray-100 grid place-items-center hover:bg-gray-200 transition" aria-label="facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#333"><path d="M22.5 12c0-6.627-5.373-12-12-12S-1.5 5.373-1.5 12c0 5.989 4.388 10.954 10.125 11.854V15.4687H7.578v-3.4687h2.547V9.35625c0-3.0075 1.7916-4.66875 4.5326-4.66875 1.3125 0 2.68625.23437 2.68625.23437v2.95156h-1.5125c-1.4906 0-1.9556.92508-1.9556 1.87437v1.64063h2.3281l-.532 3.46875h-1.7984V23.8542C18.1118 22.954 22.5 17.9895 22.5 12z"/></svg>
            </a>

            <a href="#" className="w-10 h-10 rounded-md bg-gray-100 grid place-items-center hover:bg-gray-200 transition" aria-label="twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#333"><path d="M8.05016 21.7502C17.1045 21.7502 22.0583 14.2469 22.0583 7.74211C22.0583 7.53117 22.0536 7.31554 22.0442 7.1046C23.0079 6.40771 23.8395 5.5445 24.5 4.55554C23.6025 4.95484 22.6496 5.21563 21.6739 5.32898C22.7013 4.71315 23.4705 3.74572 23.8391 2.60601C22.8726 3.1788 21.8156 3.58286 20.7134 3.80085C19.9708 3.01181 18.989 2.48936 17.9197 2.3143C16.8504 2.13923 15.7532 2.32129 14.7977 2.83234C13.8423 3.34339 13.0818 4.15495 12.6338 5.14156C12.1859 6.12816 12.0754 7.23486 12.3195 8.29054C10.3625 8.19233 8.44794 7.68395 6.69998 6.79834C4.95203 5.91274 3.40969 4.66968 2.17297 3.14976C1.5444 4.23349 1.35206 5.51589 1.63503 6.73634C1.918 7.95678 2.65506 9.02369 3.69641 9.72023C2.91463 9.69541 2.14998 9.48492 1.46563 9.10617C1.46492 10.3044 1.8581 11.4068 2.57831 12.287C3.29852 13.1672 4.30132 13.7708 5.41625 13.9952C4.69206 14.1934 3.93198 14.2222 3.19484 14.0796C3.50945 15.0577 4.12157 15.9131 4.94577 16.5266C5.76997 17.14 6.76512 17.4808 7.79234 17.5015C6.04842 18.8714 3.89417 19.6144 1.67656 19.6109C1.28329 19.6103 0.890399 19.5861 0.5 19.5387C2.75286 20.984 5.37353 21.7516 8.05016 21.7502z"/></svg>
            </a>

            <a href="#" className="w-10 h-10 rounded-md bg-gray-100 grid place-items-center hover:bg-gray-200 transition" aria-label="linkedin">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#333"><path d="M22.7234 0H2.27187C1.29219 0 0.5 0.773438 0.5 1.72969V22.2656C0.5 23.2219 1.29219 24 2.27187 24H22.7234C23.7031 24 24.5 23.2219 24.5 22.2703V1.72969C24.5 0.773438 23.7031 0 22.7234 0zM7.62031 20.4516H4.05781V8.99531H7.62031V20.4516zM5.83906 7.43438C4.69531 7.43438 3.77188 6.51094 3.77188 5.37187C3.77188 4.23281 4.69531 3.30937 5.83906 3.30937C6.97813 3.30937 7.90156 4.23281 7.90156 5.37187C7.90156 6.50625 6.97813 7.43438 5.83906 7.43438zM20.9516 20.4516H17.3937V14.8828C17.3937 13.5562 17.3703 11.8453 15.5422 11.8453C13.6906 11.8453 13.4094 13.2937 13.4094 14.7891V20.4516H9.85625V8.99531H13.2687V10.5609H13.3156C13.7891 9.66094 14.9516 8.70938 16.6813 8.70938C20.2859 8.70938 20.9516 11.0813 20.9516 14.1656V20.4516z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="w-full px-6 py-3 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Archiva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}