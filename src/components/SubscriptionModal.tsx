
interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
    if (!isOpen) return null;

    const tiers = [
        { name: 'Free', price: '$0', features: ['Anuncios Gratis', 'Calidad horrible', 'hola'] },
        { name: 'Premium', price: '$999.99', features: ['Con anuncios', 'Calidad', 'Soporte 25/7'] },
        { name: 'Familiar', price: 'Un taco del jacks', features: ['todo incluido', 'es mas yo te doy 6 pesos y un vualá', 'Calidad+'] }
    ];

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 w-full max-w-2xl rounded-sm p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white text-2xl">&times;</button>
                
                <h2 className="text-xl font-bold tracking-widest uppercase mb-8 text-center text-zinc-100">Suscripción</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {tiers.map(tier => (
                        <div key={tier.name} className="bg-zinc-950 p-6 rounded-sm border border-zinc-800 flex flex-col items-center">
                            <h3 className="text-zinc-400 text-xs uppercase tracking-tighter mb-2">{tier.name}</h3>
                            <p className="text-3xl font-black text-white mb-6">{tier.price}<span className="text-xs text-zinc-600 font-normal">/mes</span></p>
                            <ul className="space-y-3 mb-8 w-full">
                                {tier.features.map(f => (
                                    <li key={f} className="text-[10px] text-zinc-500 uppercase flex items-center gap-2">
                                        <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-2 bg-zinc-100 text-zinc-900 text-xs font-bold uppercase rounded-sm hover:bg-white transition-colors">Seleccionar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;