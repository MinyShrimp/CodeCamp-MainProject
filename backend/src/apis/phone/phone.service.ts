import {
    CACHE_MANAGER,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MESSAGES } from 'src/commons/message/Message.enum';
import { PhoneUtil } from 'src/commons/utils/phone.util';
import { PhoneInput } from './dto/phone.input';
import { PhoneEntity } from './entities/phone.entity';
import { PhoneRepository } from './entities/phone.repository';

@Injectable()
export class PhoneService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManage: Cache,
        private readonly phoneRepository: PhoneRepository, //
    ) {}

    private async isValidAuthPhone(phoneNumber: string) {
        const phone = await this.phoneRepository.findOneByPhone(phoneNumber);
        if (!phone) {
            throw new ConflictException(MESSAGES.USER_UNVALID_PHONE);
        }
        return phone;
    }

    private async isAlreadyAuthPhone(phoneNumber: string) {
        const phone = await this.phoneRepository.findOneByPhone(phoneNumber);
        if (phone) {
            throw new ConflictException(MESSAGES.USER_OVERLAP_PHONE);
        }
        return phone;
    }

    async setTokenByRedis(
        phoneNumber: string, //
        token: string,
    ) {
        const key = `auth:phone:${phoneNumber}`;
        return await this.cacheManage.set(key, token, { ttl: 120 });
    }

    async getTokenByRedis(
        phoneNumber: string, //
    ) {
        const key = `auth:phone:${phoneNumber}`;
        return await this.cacheManage.get<string>(key);
    }

    async setTokenByRedisOK(
        phoneNumber: string, //
        token: string,
    ) {
        const key = `auth:phone:${phoneNumber}:ok`;
        return await this.cacheManage.set(key, token, { ttl: 0 });
    }

    async getTokenByRedisOK(
        phoneNumber: string, //
    ) {
        const key = `auth:phone:${phoneNumber}:ok`;
        return await this.cacheManage.get<string>(key);
    }

    async deleteTokenByRedisOK(
        phoneNumber: string, //
    ) {
        const key = `auth:phone:${phoneNumber}:ok`;
        return await this.cacheManage.del(key);
    }

    /**
     * 핸드폰 인증 번호 보내기
     * @param phone
     * @returns
     */
    async SendPhone(
        phone: string, //
    ): Promise<string> {
        await this.isAlreadyAuthPhone(phone);

        const result = await PhoneUtil.sendSMS(phone);
        if (result.isOK) {
            await this.setTokenByRedis(phone, result.token);
            return process.env.MODE === 'LOCAL' ? result.token : '';
        } else {
            throw new ConflictException(MESSAGES.UNVLIAD_ACCESS);
        }
    }

    /**
     * 핸드폰 인증 확인
     * @param phoneInput
     * @returns
     */
    async AuthPhoneOK(
        phoneInput: PhoneInput, //
    ): Promise<string> {
        await this.isAlreadyAuthPhone(phoneInput.phone);

        const redisToken = await this.getTokenByRedis(phoneInput.phone);
        if (redisToken) {
            if (redisToken === phoneInput.token) {
                await this.setTokenByRedisOK(phoneInput.phone, redisToken);
                return 'auth ok';
            }
        }
        throw new ConflictException(MESSAGES.UNVLIAD_ACCESS);
    }

    async create(
        phoneNumber: string, //
    ): Promise<PhoneEntity> {
        await this.isAlreadyAuthPhone(phoneNumber);
        const redisToken = await this.getTokenByRedisOK(phoneNumber);
        if (redisToken) {
            await this.deleteTokenByRedisOK(phoneNumber);
            return await this.phoneRepository.create({
                phone: phoneNumber,
                token: redisToken,
            });
        }
        throw new ConflictException(MESSAGES.USER_UNVALID_PHONE);
    }
}
